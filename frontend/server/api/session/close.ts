import {
  openNewSession,
  validateName,
} from '../../session-controller-instance';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    const body = await readBody(event);

    const { sessionName, icon } = body;

    if (!sessionName || !icon) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: ' + sessionName + ', ' + icon,
      });
    }
    if (!validateName(sessionName)) {
      throw createError({
        statusCode: 422,
        statusMessage:
          'Invalid session name or icon: ' + sessionName + ', ' + icon,
      });
    }

    return openNewSession(sessionName, icon);
  }
});
