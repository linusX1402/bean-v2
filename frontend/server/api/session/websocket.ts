import { defineWebSocketHandler } from 'h3';

export default defineWebSocketHandler({
  // Called when a new client connects
  open(peer) {
    console.log('[ws] open', peer);
    peer.send('Hello from server!');
  },

  // Called when a client sends a message
  message(peer, message) {
    console.log('[ws] message', peer, message);
    // Echo the message back to the client
    peer.send({ message: `You sent: ${message.text()}` });
  },

  // Called when a client disconnects
  close(peer, event) {
    console.log('[ws] close', peer, event);
  },

  // Called when an error occurs
  error(peer, error) {
    console.log('[ws] error', peer, error);
  },
});
