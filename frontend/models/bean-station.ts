import Child from './child';

export class BeanStation {
  public static runningStationId = 0;
  public readonly id: number;
  public hexColor: string;
  public name: string;
  private _children;

  constructor(
    hexColor: string,
    name: string,
    id?: number,
    children: Map<number, Child> = new Map<number, Child>(),
  ) {
    this.id = id ?? BeanStation.runningStationId;
    if (!id) {
      BeanStation.runningStationId++;
    }
    this.hexColor = hexColor;
    this.name = name;
    this._children = children;
  }

  public addChild(child: Child): void {
    this._children.set(child.id, child);
  }

  get children(): Map<number, Child> {
    return this._children;
  }
}
