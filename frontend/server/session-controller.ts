import BeanSession from '~/models/bean-session';
import { BeanStation } from '~/models/bean-station';

import { v4 as uuid4 } from 'uuid';
import NewBeanSessionDTO from '~/models/new-bean-session-dto';
import Child from '~/models/child';
import {
  SESSION_CLEANUP_AGE,
  SESSION_CLEANUP_INTERVAL,
  type workingState,
} from '~/constants/constants';
import jsonMapService from '~/composables/json-map-service';

export default class SessionController {
  constructor() {
    setInterval(() => {
      this.clearOldSessions();
    }, SESSION_CLEANUP_INTERVAL);
  }

  private _openSessions = new Map<string, BeanSession>();

  private clearOldSessions() {
    const now = new Date();
    this._openSessions.forEach((session, sessionId) => {
      if (
        session.lastInteractionDate.getTime() <
        now.getTime() - SESSION_CLEANUP_AGE
      ) {
        console.log(
          'cleared session',
          sessionId,
          'created at',
          session.creationDate,
        );
        this._openSessions.delete(sessionId);
      }
    });
  }

  removeChild(childId: any, stationId: any, sessionId: any): boolean {
    const session = this.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} does not exist.`);
    }
    return session.removeChild(childId, stationId) ?? false;
  }
  public openNewSession(newSession: NewBeanSessionDTO): BeanSession {
    let sessionIdAdmin = uuid4();
    let sessionIdEditor = uuid4();
    let sessionIdUser = uuid4();
    this._openSessions.set(
      sessionIdAdmin,
      new BeanSession(
        newSession.name,
        newSession.icon,
        sessionIdAdmin,
        sessionIdEditor,
        sessionIdUser,
        newSession.secondsPerTick,
        newSession.beansPerTick,
        newSession.startingFunds,
      ),
    );
    return this.openSessions.get(sessionIdAdmin)!;
  }

  get openSessions() {
    return this._openSessions;
  }

  private getSessionById(sessionId: string) {
    return [...this._openSessions.entries()].find(([, v]) =>
      v.containsSessionId(sessionId),
    )?.[1];
  }

  getSessionDtoById(sessionId: string) {
    const session = [...this._openSessions.entries()].find(([, v]) =>
      v.containsSessionId(sessionId),
    )?.[1];
    if (session) {
      return jsonMapService().session.toJson(session);
    }
  }

  getSessionByName(name: string) {
    const session = [...this._openSessions.entries()].find(
      ([, v]) => v.name === name,
    )?.[1];
    if (session) {
      return jsonMapService().session.toJson(session);
    }
  }

  public closeSession(adminSessionId: string) {
    return this._openSessions.delete(adminSessionId);
  }

  public addChild(name: string, stationId: number, sessionId: string) {
    const session =
      this._openSessions.get(sessionId) ||
      this._openSessions.forEach((s) => s.sessionIdEditor === sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} does not exist.`);
    }
    return this._openSessions
      .get(session.sessionIdAdmin)
      ?.addChild(name, stationId);
  }

  addStation(stationName: string, hexColor: string, sessionId: string) {
    const session =
      this._openSessions.get(sessionId) ||
      this._openSessions.forEach((s) => s.sessionIdEditor === sessionId);
    if (!session) {
      throw new Error(`Session not found.`);
    }
    return this._openSessions
      .get(session.sessionIdAdmin)
      ?.addStation(stationName, hexColor);
  }
  getPermissionOfId(uuid: string) {
    const session = this.getSessionById(uuid);
    if (!session) {
      throw new Error(`Session with ID ${uuid} does not exist.`);
    }
    return session.getPermissionOfId(uuid);
  }
  updateChildWorkingState(
    sessionId: string,
    stationId: number,
    childId: number,
    workState: workingState,
  ): Child {
    const session = this.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} does not exist.`);
    }
    return session.updateChildWorkingState(stationId, childId, workState);
  }
}
