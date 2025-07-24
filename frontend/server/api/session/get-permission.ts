import { getPermissionOfId } from '../../session-controller-instance';

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
    return getPermissionOfId(uuid as string);
  }
});
