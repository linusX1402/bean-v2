import sessionController from '~/server/session-controller-instance';
import { broadcastDeleteChild, broadcastUpdateChild } from '~/server/routes/ws';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    const body = await readBody(event);
    const { name, stationId, sessionId } = body;

    if (!name || stationId === undefined || !sessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }
    const child = sessionController.addChild(name, stationId, sessionId);
    if (!child) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session not found',
      });
    } else {
      broadcastUpdateChild(stationId, child);
      return child;
    }
  } else if (method === 'DELETE') {
    const body = await readBody(event);
    const { childId, stationId, sessionId } = body;

    console.log(childId, stationId, sessionId);
    if (childId == null || stationId == null || sessionId == null) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }
    broadcastDeleteChild(stationId, childId, sessionId);
    return sessionController.removeChild(childId, stationId, sessionId);
  }
});
