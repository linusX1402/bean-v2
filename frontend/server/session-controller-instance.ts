import { type workingState } from '~/constants/constants';
import SessionController from './session-controller';
import NewBeanSessionDTO from '~/models/new-bean-session-dto';
import Child from '~/models/child';

const sessionController = new SessionController();
export default sessionController;

export function openNewSession(newSession: NewBeanSessionDTO) {
  return sessionController.openNewSession(newSession);
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

export function getPermissionOfId(uuid: string) {
  return sessionController.getPermissionOfId(uuid);
}

// TODO: remove function + API rounte
export function getAllSessions() {
  return sessionController.openSessions;
}
