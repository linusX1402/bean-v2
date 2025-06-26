export default class NewBeanSessionDTO {
  constructor(
    name: string,
    icon: string,
    secondsPerTick: number = 60,
    beanPerTick: number = 5,
    startingFunds: number = 5,
  ) {
    this.name = name;
    this.icon = icon;
    this.secondsPerTick = secondsPerTick;
    this.beansPerTick = beanPerTick;
    this.startingFunds = startingFunds;
  }

  public name: string;
  public icon: string;
  public secondsPerTick;
  public beansPerTick;
  public startingFunds;
}
