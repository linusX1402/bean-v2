import type { workingState } from '~/constants/constants';
import { Payout } from './payout';

export default class Child {
  public static runningChildId = 0;
  public readonly id: number;
  public name: string;
  public numberOfBeansEarned: number = 0;
  public numberOfBeansToPayout: number = 0;
  public workState: workingState = 'idle';
  public lastCheckout: Date | null = null;
  public lastCheckin: Date | null = null;
  public payoutHistory: Payout[] = [];

  constructor(name: string, startCapital?: number) {
    this.name = name;
    this.id = Child.runningChildId++;
    if (startCapital) this.addBeans(startCapital);
  }

  public addBeans(amount: number): void {
    this.numberOfBeansEarned += amount;
    this.numberOfBeansToPayout += amount;
  }

  public addPayout(amount: number): Child {
    this.payoutHistory.unshift(new Payout(amount));
    this.numberOfBeansEarned += amount;
    return this;
  }

  public updateWorkState(newState: workingState): Child {
    this.workState = newState;
    if (newState === 'working') {
      this.lastCheckin = new Date();
    } else if (newState === 'resting') {
      this.lastCheckout = new Date();
    }
    console.log(
      `Child ${this.id} (${this.name}) work state updated to ${newState}`,
    );
    console.log(this);
    return this;
  }
}
