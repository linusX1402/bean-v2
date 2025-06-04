import { closeSession } from '../../session-controller-instance';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'DELETE') {
    const adminSessionId = getHeader(event, 'adminSessionId');
    if (!adminSessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required header: adminSessionId',
      });
    }
    if (closeSession(adminSessionId)) {
      return { success: true, message: 'Session closed successfully.' };
    }
  }
});
