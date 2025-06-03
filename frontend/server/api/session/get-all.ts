import { getOpenSessions } from '../../session-controller-instance';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    return getOpenSessions();
  }
});
