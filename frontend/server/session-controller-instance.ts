import SessionController from './session-controller';

const sessionController = new SessionController();
export default sessionController;

export function openNewSession(name: string, iconId: string) {
  return sessionController.openNewSession(name, iconId);
}
export function getSessionById(sessionId: string) {
  return sessionController.getSessionById(sessionId);
}
//ToDo: remove after testing
export function getOpenSessions() {
  return sessionController.openSessions;
}
