import BeanSession from '../../models/session';
import { v4 as uuid4 } from 'uuid';

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

  getSessionById(sessionId: string) {
    const session = [...this._openSessions.entries()].find(([, v]) =>
      v.containsSessionId(sessionId),
    )?.[1];
    if (session) {
      return new BeanSession(
        session.name || '',
        session.icon || '',
        sessionId === session?.sessionIdAdmin ? sessionId : '',
        sessionId === session?.sessionIdEditor ||
        sessionId ||
        sessionId === session?.sessionIdAdmin
          ? session.sessionIdUser
          : '',
        session!.sessionIdUser,
      );
    }
  }

  getSessionByName(name: string) {
    const session = [...this._openSessions.entries()].find(
      ([, v]) => v.name === name,
    )?.[1];
    if (session) {
      return new BeanSession(
        session.name,
        session.icon,
        '',
        '',
        session.sessionIdUser,
      );
    }
  }

  public closeSession(adminSessionId: string) {
    return this._openSessions.delete(adminSessionId);
  }
}
