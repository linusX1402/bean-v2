export class Payout {
  public static runningPayoutId = 0;
  public readonly id: number;
  public readonly payoutAmount: number;
  public readonly payoutTime: Date;

  constructor(payoutAmount: number) {
    this.id = Payout.runningPayoutId++;
    this.payoutAmount = payoutAmount;
    this.payoutTime = new Date();
  }
}
