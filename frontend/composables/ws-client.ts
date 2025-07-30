import type Child from '~/models/child';
import type { workingState } from '~/constants/constants';
import { useRouter } from 'vue-router';
import JsonMapService from '~/composables/json-map-service';

const ws = ref<WebSocket | undefined>(undefined);
const receivedMessage = ref<string[]>([]);
export const useWebSocket = () => {
  const openConnection = (sessionId: string) => {
    if (!ws.value) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      ws.value = new WebSocket(wsUrl);

      ws.value.onopen = () => {
        console.log('[ws] open');
        console.log(`[ws] sessionId: ${sessionId}`);
        const message = {
          header: 'verify',
          sessionId: sessionId,
        };
        ws.value?.send(JSON.stringify(message));
      };

      ws.value.onclose = () => {
        console.log('WebSocket connection closed');
        ws.value = undefined;
      };

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log('[ws] trying to reconnect...');
        setTimeout(() => {
          openConnection(sessionId);
        }, 2000);
      };

      ws.value.onmessage = (event) => {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          console.log('[ws] message received:', data);
          receivedMessage.value.push(event.data);
          if (data.code === 401) {
            window.location.href = '/login';
          }
          switch (data.header) {
            case 'update-child':
              handleUpdateChild(data);
              break;
            case 'delete-child':
              useSession().removeChild(data.stationId, data.childId);
              break;
            case 'update-station':
              handleUpdateStation(data);
              break;
            default:
              console.warn('[ws] unknown message header:', data.header);
          }
        }
      };
    }
  };
  const sendMessage = (message: string) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(message);
    }
  };

  const updateChild = (
    childId: number,
    stationId: number,
    workState: workingState,
  ) => {
    console.log('childId: ', childId);
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      const message = {
        header: 'update-child',
        stationId: stationId,
        childId: childId,
        workState: workState,
      };
      ws.value.send(JSON.stringify(message));
    }
  };

  function handleUpdateChild(data: any) {
    console.log(data.child);
    const child = data.child as Child;
    useSession().updateChild(data.stationId, child);
  }

  function handleUpdateStation(data: any) {
    const station = JsonMapService().station.fromJson(data.station);
    useSession().updateStation(station);
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      if (ws.value) {
        ws.value.close();
        ws.value = undefined;
      }
    });
  }
  return {
    openConnection,
    updateChild,
    ws,
    receivedMessage,
    sendMessage,
  };
};
