export class Payout {
  public readonly id: number;
  public readonly payoutAmount: number;
  public readonly payoutTime: Date;

  constructor(id: number, payoutAmount: number, payoutTime: Date) {
    this.id = id;
    this.payoutAmount = payoutAmount;
    this.payoutTime = payoutTime;
  }
}
