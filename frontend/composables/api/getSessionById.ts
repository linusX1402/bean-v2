import type BeanSessionDTO from '../../../models/bean-session-dto';
import { getDynamicBaseURL } from '~/composables/dynamic-base-url';

export async function getSessionById(
  sessionId: string,
): Promise<BeanSessionDTO | undefined> {
  const baseUrl = getDynamicBaseURL();
  console.log('baseUrl: ' + baseUrl);
  try {
    const session = await $fetch(`${baseUrl}/api/session/get-by-uuid`, {
      method: 'GET',
      headers: { uuid: sessionId },
    });
    return session as unknown as BeanSessionDTO;
  } catch (error) {
    console.error('Error fetching session:', error);
  }
}
