import type { Payout } from '~/composables/payout';

type workState = 'working' | 'onBreak' | 'idle';
export default class Child {
  public name: string;
  public numberOfBeansEarned: number = 0;
  public numberOfBeansToPayout: number = 0;
  public state: workState = 'idle';
  public isWorking: boolean = false;
  public lastCheckout: Date | null = null;
  public lastCheckin: Date | null = null;
  public payoutHistory: Payout[] = [];

  constructor(name: string, startCapital?: number) {
    this.name = name;
    if (startCapital) this.addBeans(startCapital);
  }

  public addBeans(amount: number): void {
    this.numberOfBeansEarned += amount;
    this.numberOfBeansToPayout += amount;
  }
}
