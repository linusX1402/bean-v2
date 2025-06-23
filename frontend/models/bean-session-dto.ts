import { BeanStation } from './bean-station';

export default class BeanSessionDTO {
  constructor(
    name: string,
    icon: string,
    sessionIdAdmin: string,
    sessionIdEditor: string,
    sessionIdUser: string,
    secondsPerTick: number = 60,
    beanPerTick: number = 5,
    startingFunds: number = 5,
    stations: BeanStation[] = [],
  ) {
    this.name = name;
    this.icon = icon;
    this.sessionIdAdmin = sessionIdAdmin;
    this.sessionIdEditor = sessionIdEditor;
    this.sessionIdUser = sessionIdUser;
    this.secondsPerTick = secondsPerTick;
    this.stations = stations;
    this.beansPerTick = beanPerTick;
    this.startingFunds = startingFunds;
  }

  public static runningId = 0;
  public readonly creationDate?: Date = new Date();
  public stations: BeanStation[];
  public readonly sessionIdAdmin: string;
  public readonly sessionIdEditor: string;
  public readonly sessionIdUser: string;
  public name: string;
  public icon: string;
  public secondsPerTick;
  public beansPerTick;
  public startingFunds;

  public getHighestPermissionStationId(): string {
    if (this.sessionIdAdmin) {
      return this.sessionIdAdmin;
    } else if (this.sessionIdEditor) {
      return this.sessionIdEditor;
    } else if (this.sessionIdUser) {
      return this.sessionIdUser;
    }
    return '';
  }
}
