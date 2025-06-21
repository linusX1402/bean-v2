import { getCookie, setCookie } from 'typescript-cookie';
import { getSessionById } from '~/composables/api/getSessionById';

export default function () {
  function getForwardCookie() {
    return /true/.test(getCookie('forward') || 'false');
  }

  function getCurrentSession() {
    return JSON.parse(getCookie('bean_sessions') || '[]')[0] || '';
  }

  function setForwardCookie(forward: boolean) {
    setCookie('forward', forward ? 'true' : 'false');
  }

  function addSession(newSession: string, forward = false) {
    const pastSessions: string[] = JSON.parse(
      getCookie('bean_sessions') || '[]',
    );

    let sessionExists = false;
    pastSessions.some((session) => {
      if (session === newSession) {
        sessionExists = true;
        return true;
      }
      return false;
    });

    if (sessionExists) {
      return;
    }
    pastSessions.unshift(newSession);
    setCookie('bean_sessions', JSON.stringify(pastSessions));

    if (forward) {
      setCookie('forward', forward);
    }
  }

  async function getPermission() {
    const sessionId = getCurrentSession();
    const res = await $fetch(`/api/session/get-permission`, {
      method: 'POST',
      headers: {
        uuid: sessionId,
      },
    });
    return res;
  }

  return {
    getCurrentSession,
    setForwardCookie,
    getForwardCookie,
    addSession,
    getPermission,
  };
}
