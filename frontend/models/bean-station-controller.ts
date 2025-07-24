import {
  DEFAULT_BEANS_PER_TICK,
  DEFAULT_SECONDS_PER_TICK,
  INTERVAL_DURATION,
} from '~/constants/constants';
import type Child from './child';

export default class BeanStationController {
  private intervalId: NodeJS.Timeout | null = null;
  public readonly stationId: number;
  private isFirstLoop = true;
  public constructor(stationId: number) {
    this.stationId = stationId;
    this.startInterval();
  }

  public startInterval() {
    this.intervalId = setInterval(() => {
      useSession()
        .get()
        ?.stations.get(this.stationId)
        ?.children.forEach((child) => {
          try {
            if (child.workState === 'working') {
              this.addBeanToChild(child);
            } else if (child.workState === 'resting') {
              this.calculateRestingTime(child);
            }
            this.isFirstLoop = false;
          } catch (error) {
            console.error(
              '[BeanStationController] Error accessing session or station:',
              error,
            );
          }
        });
      console.log('[BeanStationController] Interval tick');
    }, INTERVAL_DURATION);
  }

  public stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public calculateRestingTime(child: Child) {
    const timeDifference =
      new Date().getTime() -
      (child.lastCheckout?.getTime() || new Date().getTime());
    const minutes = Math.floor(timeDifference / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);
    const tmpChild = useSession()
      .get()!
      .stations.get(this.stationId)
      ?.children.get(child.id);
    if (tmpChild) {
      tmpChild.timeResting = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      useSession()
        .get()!
        .stations.get(this.stationId)
        ?.children.set(child.id, tmpChild);
    } else {
      // TODO: Toast message
      console.error(
        '[BeanStationController] Child not found in session or station',
      );
    }
  }

  public addBeanToChild(child: Child) {
    child.timeResting = '00:00';
    const timeSinceLastCheckin =
      Math.floor(
        (new Date().getTime() -
          (child.lastCheckin?.getTime() || new Date().getTime())) /
          1000,
      ) + (child.storedTimeForNextBean ?? 0);
    const secondsPerTick =
      useSession().get()?.secondsPerTick || DEFAULT_SECONDS_PER_TICK;
    const beansPerTick =
      useSession().get()?.beansPerTick || DEFAULT_BEANS_PER_TICK;
    // console.log('storedTimeForNextBean: ', props.child.storedTimeForNextBean);
    console.log('timeSinceLastCheckin', timeSinceLastCheckin);
    // console.log(child.lastCheckin);
    console.log('/', timeSinceLastCheckin / secondsPerTick);
    console.log('%', timeSinceLastCheckin % secondsPerTick);
    // console.log('child: ', props.child);

    if (
      timeSinceLastCheckin % secondsPerTick === 0 &&
      timeSinceLastCheckin > 0
    ) {
      console.log('add a Bean');
      let beansToAdd = beansPerTick;
      if (this.isFirstLoop) {
        beansToAdd =
          Math.floor(timeSinceLastCheckin / secondsPerTick) * beansPerTick;
      }
      useSession().addBeans(this.stationId, child.id, beansToAdd);
    }
  }
}
