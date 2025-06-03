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
    console.log(this.openSessions);
    return this.openSessions[this.openSessions.length - 1];
  }

  get openSessions(): BeanSession[] {
    return this._openSessions;
  }

  getSessionById(sessionId: string) {
    return this._openSessions.find((i) => {
      i.containsSessionId(sessionId);
    });
  }
}
