import { addChild } from '../../session-controller-instance';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    // const { sessionId } = event.context.params || {};
    const body = await readBody(event);
    const { name, stationId, sessionId } = body;

    if (!name || !stationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }

    // Ensure `addChild` returns the created child
    const child = addChild(name, stationId, sessionId);
    return child; // Return the child as the response
  }
});
