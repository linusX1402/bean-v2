import BeanSession from '../../models/session';
import { v4 as uuid4 } from 'uuid';

export default class SessionController {
  private _openSessions: BeanSession[] = [];

  public openNewSession(name: string, iconId: string): BeanSession {
    let sessionIdAdmin = uuid4();
    let sessionIdEditor = uuid4();
    let sessionIdUser = uuid4();
    this._openSessions.push(
      new BeanSession(
        name,
        iconId,
        sessionIdAdmin,
        sessionIdEditor,
        sessionIdUser,
      ),
    );
    return this.openSessions[this.openSessions.length - 1];
  }

  get openSessions(): BeanSession[] {
    return this._openSessions;
  }

  getSessionById(sessionId: string) {
    const session = this._openSessions.find((i) =>
      i.containsSessionId(sessionId),
    );
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
    const session = this._openSessions.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
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

  public closeSession(idToRemoveSessionAdmin: string) {
    const toRemoveSession = this._openSessions.find(
      (i) => i.sessionIdAdmin === idToRemoveSessionAdmin,
    );
  }
}
