import { getDynamicBaseURL } from '~/composables/dynamic-base-url';

export default defineNuxtPlugin(() => {
  const ws = new WebSocket(getDynamicBaseURL('ws:'));

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return {
    provide: {
      websocket: ws,
    },
  };
});
