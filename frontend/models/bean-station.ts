import Child from './child';

export class BeanStation {
  public static runningStationId = 0;

  public readonly id: number;
  public hexColor: string;
  public name: string;
  public children: Child[] = [];

  constructor(hexColor: string, name: string) {
    this.id = BeanStation.runningStationId++;
    this.hexColor = hexColor;
    this.name = name;
  }

  public addChild(child: Child): void {
    this.children.push(child);
  }
}
