import BeanSession from '~/models/bean-session';
import sessionController from '~/server/session-controller-instance';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    const uuid = getHeader(event, 'uuid') || '';

    if (!uuid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }
    let session = sessionController.getSessionDtoById(uuid as string);
    if (uuid && !session) {
      session = sessionController.getSessionByName(uuid as string);
    }
    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session not found',
      });
    }
    return session;
  }
});
