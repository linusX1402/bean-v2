import { defineWebSocketHandler } from 'h3';

export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] open');
    peer.send('Hello from server!');
  },

  message(peer, message) {
    console.log('[ws] message: ', message.data?.toString());
    peer.send(`${message.data?.toString()}`);
  },

  close(peer, event) {
    console.log('[ws] close');
  },

  error(peer, error) {
    console.log('[ws] error: ', error);
  },
});
