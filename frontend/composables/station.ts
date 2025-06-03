import Child from '~/composables/child';

export class Station {
  public id: number;
  public hexColor: string;
  public name: string;
  public children: Child[] = [];

  constructor(id: number, hexColor: string, name: string) {
    this.id = id;
    this.hexColor = hexColor;
    this.name = name;
  }

  public addChild(child: Child): void {
    this.children.push(child);
  }
}
