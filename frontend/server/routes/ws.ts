import { defineWebSocketHandler } from 'h3';
import { Peer } from 'crossws';
import sessionController, {
  getAllSessions,
  getPermissionOfId,
} from '../session-controller-instance';
import Child from '~/models/child';
import { BeanStation } from '~/models/bean-station';

const MAX_VERIFICATION_TIME = 5000;
type wsClient = {
  sessionId?: string | undefined;
  peer: Peer<any>;
};
const clients = new Map<string, wsClient>();
export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] open');
    clients.set(peer.id, { peer: peer });
    handleTimout(peer);
  },

  message(peer, message) {
    const data = JSON.parse(message.data?.toString() || '{}');
    // console.log(`[ws] message received:`, data);
    if (data.header === 'verify') {
      handlePermission(peer, data);
    } else if (data.header === 'update-child') {
      handleUpdateChild(peer, data);
    }
  },

  close(peer, event) {
    clients.delete(peer.id);
    console.log(`[ws] closed: ${clients.get(peer.id)?.sessionId} (${peer.id})`);
  },

  error(peer, error) {
    clients.delete(peer.id);
    console.log(`[ws] error (${peer.id}): `, error);
  },
});
function handleUpdateChild(peer: Peer<any>, data: any) {
  const sessionId = clients.get(peer.id)?.sessionId;
  try {
    const child = sessionController.updateChildWorkingState(
      sessionId || '',
      data.stationId,
      data.childId,
      data.workState,
    );
    const message = JSON.stringify({
      header: 'update-child',
      code: '200',
      stationId: data.stationId,
      child: child,
    });
    broadcast(message);
  } catch (e: any) {
    console.warn(`[ws] update child failed (${peer.id}):`, e);
    const message = JSON.stringify({
      header: 'update-child',
      code: 401,
      error: e.message,
    });
    peer.send(message);
    console.error(`[ws] child update failed (${peer.id}):`, e);
  }
}

export function broadcastUpdateStation(data: string) {
  const message = JSON.stringify({
    header: 'update-station',
    code: 200,
    station: data,
  });
  broadcast(message);
}
export function broadcastUpdateChild(stationId: number, data: Child) {
  const message = JSON.stringify({
    header: 'update-child',
    code: 200,
    stationId: stationId,
    child: data,
  });
  broadcast(message);
}

export function broadcastDeleteChild(
  stationId: number,
  childId: number,
  sessionId: string,
) {
  const message = JSON.stringify({
    header: 'delete-child',
    code: 200,
    stationId: stationId,
    childId: childId,
  });
  broadcast(message);
}
function handlePermission(peer: Peer<any>, data: any) {
  try {
    getPermissionOfId(data.sessionId);
    clients.set(peer.id, { sessionId: data.sessionId, peer: peer });
    const message = JSON.stringify({
      header: 'verification',
      code: 200,
      error: '',
    });
    peer.send(message);
  } catch (e: any) {
    const message = JSON.stringify({
      header: 'verification',
      code: 401,
      error: e.message,
    });
    peer.send(message);
    console.error(`[ws] verification failed (${peer.id}):`, e);
    console.log(getAllSessions());
    peer.close();
  }
}

function handleTimout(peer: Peer<any>) {
  setTimeout(() => {
    try {
      if (!clients.get(peer.id)?.sessionId) {
        const message = JSON.stringify({
          header: 'verification',
          code: 200,
          error: 'verification timed out',
        });
        peer.send(message);
        console.log(`[ws] verification timed out (${peer.id})`);
        peer.close();
      }
    } catch (error) {
      console.error('[ws] Error in open handler:', error);
      peer.close();
    }
  }, MAX_VERIFICATION_TIME);
}

function broadcast(message: string) {
  clients.forEach((client) => {
    client.peer.send(message);
  });
}
