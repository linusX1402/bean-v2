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
  public storedTimeForNextBean: number = 0;
  public timeResting: string = '00:00';

  constructor(
    name: string,
    id?: number,
    startCapital?: number,
    numberOfBeansEarned?: number,
    numberOfBeansToPayout?: number,
    lastCheckout?: Date | null,
    lastCheckin?: Date | null,
    payoutHistory?: Payout[],
    workState?: workingState,
  ) {
    this.name = name;
    this.id = id ?? Child.runningChildId;
    Child.runningChildId++;
    this.numberOfBeansEarned = numberOfBeansEarned ?? 0;
    this.numberOfBeansToPayout = numberOfBeansToPayout ?? 0;
    this.lastCheckout = lastCheckout ?? null;
    this.lastCheckin = lastCheckin ?? null;
    this.payoutHistory = payoutHistory ?? [];
    this.workState = workState ?? 'idle';
    if (startCapital) this.addBeans(startCapital);
  }

  public addBeans(amount: number): void {
    this.numberOfBeansEarned += amount;
    this.numberOfBeansToPayout += amount;
  }

  public addPayout(amount: number): Child {
    this.payoutHistory.unshift(new Payout(amount));
    this.numberOfBeansEarned += amount;
    this.numberOfBeansToPayout = 0;
    return this;
  }

  public resetChild(startingFunds: number): Child {
    this.addBeans(startingFunds);
    this.workState = 'idle';
    this.lastCheckout = null;
    this.lastCheckin = null;
    this.payoutHistory = [];
    this.storedTimeForNextBean = 0;
    this.timeResting = '00:00';
    return this;
  }

  public setStoredTimeForNextBean(seconds: number) {
    this.storedTimeForNextBean = seconds;
  }

  public updateWorkState(newState: workingState): Child {
    this.workState = newState;
    if (newState === 'working') {
      this.lastCheckin = new Date();
    } else if (newState === 'resting') {
      this.lastCheckout = new Date();
    }
    console.log(this);
    return this;
  }
}
