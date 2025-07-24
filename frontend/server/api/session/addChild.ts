import sessionController from '~/server/session-controller-instance';

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
    const child = sessionController.addChild(name, stationId, sessionId);
    console.log('added child', child);
    console.log(
      'children currently in station',
      stationId,
      'are',
      sessionController.getSessionDtoById(sessionId),
    );
    return child; // Return the child as the response
  }
});
