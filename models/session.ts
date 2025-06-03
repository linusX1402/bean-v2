export default class BeanSession {
  constructor(
    name: string,
    icon: string,
    sessionIdAdmin: string,
    sessionIdEditor: string,
    sessionIdUser: string,
  ) {
    this._name = name;
    this._icon = icon;
    this.sessionIdAdmin = sessionIdAdmin;
    this.sessionIdEditor = sessionIdEditor;
    this.sessionIdUser = sessionIdUser;
  }

  public readonly sessionIdAdmin: string;
  public readonly sessionIdEditor: string;
  public readonly sessionIdUser: string;
  private _name: string;
  private _icon: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  public getSessionIdByRole(role: string): string {
    role = role.toLowerCase();
    switch (role) {
      case "admin":
        return this.sessionIdAdmin;
      case "edit":
        return this.sessionIdEditor;
      case "view":
        return this.sessionIdUser;
      default:
        throw new Error("Invalid role");
    }
  }

  public containsSessionId(sessionId: string): boolean {
    return (
      this.sessionIdAdmin === sessionId ||
      this.sessionIdEditor === sessionId ||
      this.sessionIdUser === sessionId
    );
  }
}
