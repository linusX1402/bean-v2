import { getDynamicBaseURL } from '~/composables/dynamic-base-url';
import type BeanSession from '~/models/bean-session';

export async function getSessionById(
  sessionId: string,
): Promise<BeanSession | undefined> {
  const baseUrl = getDynamicBaseURL();
  try {
    const jsonSession = await $fetch(`${baseUrl}/api/session/get-by-uuid`, {
      method: 'GET',
      headers: { uuid: sessionId },
    });
    const jsonRes = jsonMapService().session.fromJson(jsonSession);
    return jsonRes;
  } catch (error) {
    console.error('Error fetching session:', error);
  }
}
