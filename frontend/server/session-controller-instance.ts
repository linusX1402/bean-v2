import SessionController from './session-controller';

const sessionController = new SessionController();
export default sessionController;

export function openNewSession(name: string, iconId: string) {
  return sessionController.openNewSession(name, iconId);
}
export function getSessionById(sessionId: string) {
  console.log(`getSession by id (${sessionController.openSessions.length}):`);
  try {
    console.log(
      sessionController.getSessionById(
        sessionController.openSessions[0].sessionIdAdmin,
      ),
    );
  } catch (error) {}
  return sessionController.getSessionById(sessionId);
}
//ToDo: remove after testing
export function getOpenSessions() {
  return sessionController.openSessions;
}
