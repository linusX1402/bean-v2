import Child from './child';

export class BeanStation {
  public static runningStationId = 0;

  public readonly id: number;
  public hexColor: string;
  public name: string;
  public children = new Map<number, Child>();

  constructor(hexColor: string, name: string, id?: number) {
    this.id = id ?? BeanStation.runningStationId;
    if (!id) {
      BeanStation.runningStationId++;
    }
    this.hexColor = hexColor;
    this.name = name;
  }

  public addChild(child: Child): void {
    this.children.set(child.id, child);
  }
}
