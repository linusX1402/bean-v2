import SessionController from './session-controller';
import { BeanStation } from '~/models/bean-station';
import NewBeanSessionDTO from '~/models/new-bean-session-dto';

const sessionController = new SessionController();
export default sessionController;

export function openNewSession(newSession: NewBeanSessionDTO) {
  return sessionController.openNewSession(newSession);
}
export function getSessionById(sessionId: string) {
  console.log(`open session: (${sessionController.openSessions.size}):`);
  return sessionController.getSessionDtoById(sessionId);
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

export function addChild(name: string, stationId: number, sessionId: string) {
  return sessionController.addChild(name, stationId, sessionId);
}

export function addStation(
  stationName: string,
  hexColor: string,
  stationId: string,
) {
  return sessionController.addStation(stationName, hexColor, stationId);
}

export function gtePermissionOfId(uuid: string) {
  return sessionController.getPermissionOfId(uuid);
}
