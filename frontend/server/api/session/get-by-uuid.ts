import {
  getSessionById,
  getSessionByName,
} from '../../session-controller-instance';
import BeanSession from '../../../../models/session';

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
    let session = getSessionById(uuid as string);
    if (uuid && !session) {
      session = getSessionByName(uuid as string);
    }
    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session not found',
      });
    }
    return session as BeanSession;
  }
});
