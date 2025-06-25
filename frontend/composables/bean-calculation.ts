import {
  DEFAULT_BEANS_PER_TICK,
  DEFAULT_SECONDS_PER_TICK,
  type workingState,
} from '~/constants/constants';
import type Child from '~/models/child';

export default function useBeanCalculation() {
  function calculateBeanPayout(
    workState: workingState,
    stationId: number,
    child: Child,
    tickCounter: Ref<number>,
    timeResting: Ref<string>,
  ) {
    let isFirstLoopAfterInit = true;
    const interval = setInterval(() => {
      if (workState === 'resting') {
        calculateRestingTimer(child, timeResting);
      } else if (workState === 'working') {
        timeResting.value = '00:00';
        const timeSinceLastCheckin =
          Math.floor(
            (new Date().getTime() -
              (child.lastCheckin?.getTime() || new Date().getTime())) /
              1000,
          ) + (child.storedTimeForNextBean ?? 0);
        console.log('storedTimeForNextBean: ', child.storedTimeForNextBean);
        const secondsPerTick =
          useSession().get()?.secondsPerTick || DEFAULT_SECONDS_PER_TICK;
        const beansPerTick =
          useSession().get()?.beansPerTick || DEFAULT_BEANS_PER_TICK;
        console.log('timeSinceLastCheckin', timeSinceLastCheckin);
        console.log(timeSinceLastCheckin / secondsPerTick);
        let ticksPassed = Math.floor(timeSinceLastCheckin / secondsPerTick);

        if (ticksPassed > tickCounter.value) {
          console.log('add a Bean');
          let beansToAdd = beansPerTick;
          if (isFirstLoopAfterInit) {
            beansToAdd = ticksPassed * beansPerTick;
            tickCounter.value = ticksPassed;
          } else {
            tickCounter.value++;
          }
          isFirstLoopAfterInit = false;
          try {
            useSession().addBeans(stationId, child.id, beansToAdd);
          } catch (error) {
            console.error('Error updating child beans:', error);
          }
        }
      }
    }, 1000);

    onUnmounted(() => {
      clearInterval(interval);
    });

    return () => clearInterval(interval);
  }

  function calculateRestingTimer(child: Child, timeResting: Ref<string>) {
    const timeDifference =
      new Date().getTime() -
      (child.lastCheckout?.getTime() || new Date().getTime());
    const minutes = Math.floor(timeDifference / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);
    timeResting.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return { calculateBeanPayout };
}
