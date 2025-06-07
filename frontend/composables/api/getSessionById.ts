import type BeanSessionDTO from '../../../models/bean-session-dto';

export async function getSessionById(
  sessionId: string,
): Promise<BeanSessionDTO | undefined> {
  try {
    const session = await $fetch(
      `${useRuntimeConfig().public.baseURL}/api/session/get-by-uuid`,
      {
        method: 'GET',
        headers: { uuid: sessionId },
      },
    );
    return session as unknown as BeanSessionDTO;
  } catch (error) {
    console.error('Error fetching session:', error);
  }
}
