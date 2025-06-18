import {
  gtePermissionOfId,
  getSessionByName,
} from '../../session-controller-instance';
import BeanSessionDTO from '~/models/bean-session-dto';

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
    return gtePermissionOfId(uuid as string);
  }
});
