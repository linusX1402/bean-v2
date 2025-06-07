import { addStation } from '../../session-controller-instance';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    const body = await readBody(event);
    const { sessionId, stationName, hexColor } = body;

    if (!stationName || !hexColor || !sessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }

    return addStation(stationName, hexColor, sessionId as string);
  }
});
