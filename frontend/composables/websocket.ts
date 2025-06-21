const ws = ref<WebSocket | undefined>(undefined);
const receivedMessage = ref<string[]>([]);
export const useWebSocket = () => {
  const openConnection = () => {
    if (!ws.value) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      ws.value = new WebSocket(wsUrl);

      ws.value.onopen = () => {
        console.log('[ws] open');
        ws.value?.send('Hello from client!');
      };

      ws.value.onclose = () => {
        console.log('WebSocket connection closed');
        ws.value = undefined;
      };

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  };
  const sendMessage = (message: string) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(message);
    }
  };
  onUnmounted(() => {
    if (ws.value) {
      ws.value.close();
      ws.value = undefined;
    }
  });
  return {
    openConnection,
    ws,
    receivedMessage,
    sendMessage,
  };
};
