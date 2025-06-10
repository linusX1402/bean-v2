import { WebSocketServer } from 'ws';

export default defineEventHandler((event) => {
  const wss = new WebSocketServer({ noServer: true });

  event.node.res.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('Received:', message);
      ws.send(`Echo: ${message}`);
    });
  });
});
