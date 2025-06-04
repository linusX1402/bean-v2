import type BeanSession from '../../../models/session';

export async function getSessionById(
  sessionId: string,
): Promise<BeanSession | undefined> {
  try {
    const session = await $fetch(
      `${useRuntimeConfig().public.baseURL}/api/session/get-by-uuid`,
      {
        method: 'GET',
        headers: { uuid: sessionId },
      },
    );
    return session as BeanSession;
  } catch (error) {
    console.error('Error fetching session:', error);
  }
}
