import sessionController from '~/server/session-controller-instance';
import { child } from 'winston';

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

    // Ensure `addChild` returns the created child
    return sessionController.addChild(name, stationId, sessionId);
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
    return sessionController.removeChild(childId, stationId, sessionId);
  }
});
