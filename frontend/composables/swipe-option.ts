export class swipeOption {
  public iconPath: string;
  public twColor: string;
  public text?: string;

  constructor(iconPath: string, twColor: string, text?: string) {
    this.iconPath = iconPath;
    this.twColor = twColor;
    this.text = text;
  }
}
