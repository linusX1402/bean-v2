import { BeanStation } from "./bean-station";
import Child from "./child";

export default class BeanSession {
  constructor(
    name: string,
    icon: string,
    sessionIdAdmin: string,
    sessionIdEditor: string,
    sessionIdUser: string,
    secondsPerTick: number = 60,
    beanPerTick: number = 5,
    startingFunds: number = 5,
    stations: Map<number, BeanStation> = new Map<number, BeanStation>(),
  ) {
    this._name = name;
    this._icon = icon;
    this.sessionIdAdmin = sessionIdAdmin;
    this.sessionIdEditor = sessionIdEditor;
    this.sessionIdUser = sessionIdUser;
    this.secondsPerTick = secondsPerTick;
    this._stations = stations;
    this.beanPerTick = beanPerTick;
    this.startingFunds = startingFunds;
  }

  public static runningId = 0;
  public readonly creationDate: Date = new Date();
  private _stations = new Map<number, BeanStation>();
  public readonly sessionIdAdmin: string;
  public readonly sessionIdEditor: string;
  public readonly sessionIdUser: string;
  private _name: string;
  private _icon: string;
  public secondsPerTick;
  public beanPerTick;
  public startingFunds;

  get stations(): Map<number, BeanStation> {
    return this._stations;
  }

  public addStation(stationName: string, hexColor: string): BeanStation {
    const tmpStation = new BeanStation(hexColor, stationName);
    this._stations.set(BeanSession.runningId, tmpStation);
    BeanSession.runningId++;
    return tmpStation;
  }

  public addChild(name: string, stationId: number) {
    const child = new Child(name, this.startingFunds);
    this._stations.forEach((key, value) => {
      if (value === stationId) {
        key.addChild(child);
      }
    });
    return child;
  }

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
    let substr = Math.max(sessionId.length, 10);
    return (
      this.sessionIdAdmin.substring(0, substr) ===
        sessionId.substring(0, substr) ||
      this.sessionIdEditor.substring(0, substr) ===
        sessionId.substring(0, substr) ||
      this.sessionIdUser.substring(0, substr) === sessionId.substring(0, substr)
    );
  }

  public getHighestPermissionSessionId(): string {
    if (this.sessionIdAdmin) {
      return this.sessionIdAdmin;
    } else if (this.sessionIdEditor) {
      return this.sessionIdEditor;
    } else {
      return this.sessionIdUser;
    }
  }

  public getPermissionOfId(uuid: string): string {
    if (this.sessionIdAdmin === uuid) {
      return "admin";
    } else if (this.sessionIdEditor === uuid) {
      return "edit";
    } else if (this.sessionIdUser === uuid) {
      return "view";
    } else {
      throw new Error(`Session with ID ${uuid} does not exist.`);
    }
  }
}
