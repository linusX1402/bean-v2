import type Child from '~/models/child';
import type { workingState } from '~/constants/constants';

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
      };

      ws.value.onmessage = (event) => {
        if (typeof event.data === 'string') {
          console.log('[ws] message received:', event.data);
          receivedMessage.value.push(event.data);
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
  ): Promise<Child> => {
    return new Promise((resolve, reject) => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        const message = {
          header: 'update-child',
          stationId: stationId,
          childId: childId,
          workState: workState,
        };

        ws.value.send(JSON.stringify(message));

        const handleMessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data.header === 'update-child' && data.childId === childId) {
              ws.value?.removeEventListener('message', handleMessage);
              resolve(data);
            }
          } catch (error) {
            reject(error);
          }
        };

        ws.value.addEventListener('message', handleMessage);

        // Optional: Add a timeout to reject the promise if no response is received
        setTimeout(() => {
          ws.value?.removeEventListener('message', handleMessage);
          reject(new Error('Timeout waiting for update-child response'));
        }, 5000); // 5 seconds timeout
      } else {
        reject(new Error('WebSocket is not open'));
      }
    });
  };

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
