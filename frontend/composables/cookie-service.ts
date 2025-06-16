import { getCookie, setCookie } from 'typescript-cookie';

export default function () {
  function getForwardCookie() {
    return /true/.test(getCookie('forward') || 'false');
  }

  function getLastSession() {
    return JSON.parse(getCookie('bean_sessions') || '[]')[0] || '';
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

    console.log(sessionExists);
    if (sessionExists) {
      return;
    }
    pastSessions.unshift(newSession);
    setCookie('bean_sessions', JSON.stringify(pastSessions));

    if (forward) {
      setCookie('forward', forward);
    }
  }
  return {
    getLastSession,
    getForwardCookie,
    addSession,
  };
}
