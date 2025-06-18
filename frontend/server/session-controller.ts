import BeanSession from '~/models/bean-session';
import { BeanStation } from '~/models/bean-station';

import { v4 as uuid4 } from 'uuid';
import BeanSessionDTO from '~/models/bean-session-dto';

export default class SessionController {
  private _openSessions = new Map<string, BeanSession>();

  public openNewSession(name: string, iconId: string): BeanSession {
    let sessionIdAdmin = uuid4();
    let sessionIdEditor = uuid4();
    let sessionIdUser = uuid4();
    this._openSessions.set(
      sessionIdAdmin,
      new BeanSession(
        name,
        iconId,
        sessionIdAdmin,
        sessionIdEditor,
        sessionIdUser,
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
      return this.toDTO(session);
    }
  }

  getSessionByName(name: string) {
    const session = [...this._openSessions.entries()].find(
      ([, v]) => v.name === name,
    )?.[1];
    if (session) {
      return this.toDTO(session);
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
    return session.addChild(name, stationId);
  }

  addStation(stationName: string, hexColor: string, sessionId: string) {
    const session =
      this._openSessions.get(sessionId) ||
      this._openSessions.forEach((s) => s.sessionIdEditor === sessionId);
    if (!session) {
      throw new Error(`Session not found.`);
    }
    return session.addStation(stationName, hexColor);
  }

  toDTO(session: BeanSession): BeanSessionDTO {
    return new BeanSessionDTO(
      session.name,
      session.icon,
      session.sessionIdAdmin,
      session.sessionIdEditor,
      session.sessionIdUser,
      session.secondsPerTick,
      session.beanPerTick,
      session.startingFunds,
      Array.from(session.stations.values()),
    );
  }

  getPermissionOfId(uuid: string) {
    const session = this.getSessionById(uuid);
    if (!session) {
      throw new Error(`Session with ID ${uuid} does not exist.`);
    }
    return session.getPermissionOfId(uuid);
  }
}
