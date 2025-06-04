import SessionController from './session-controller';

const sessionController = new SessionController();
export default sessionController;

export function openNewSession(name: string, iconId: string) {
  return sessionController.openNewSession(name, iconId);
}
export function getSessionById(sessionId: string) {
  console.log(`session count: (${sessionController.openSessions.size}):`);
  return sessionController.getSessionById(sessionId);
}

export function getSessionByName(name: string) {
  return sessionController.getSessionByName(name);
}

export function validateName(name: string) {
  return (
    name.length <= 50 &&
    ![...sessionController.openSessions.values()].some((s) => s.name === name)
  );
}

export function closeSession(adminId: string) {
  return sessionController.closeSession(adminId);
}
