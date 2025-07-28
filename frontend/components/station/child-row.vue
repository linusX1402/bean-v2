<script setup lang="ts">
import type Child from '~/models/child';
import { getCookie } from 'typescript-cookie';
import {
  DEFAULT_BEANS_PER_TICK,
  DEFAULT_ICON,
  DEFAULT_SECONDS_PER_TICK,
  type headerUpdateStates,
  type iconList,
  INTERVAL_TIME_TIMER,
  type workingState as workState,
} from '~/constants/constants';
import GestureSwipe from '~/components/ui/gesture-swipe.vue';

const props = withDefaults(
  defineProps<{
    child: Child;
    stationId: number;
    lastHeaderUpdate?: headerUpdateStates;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

const emit = defineEmits(['update:work-state']);

let ticksPassed = 0;
const childEditRef = ref<HTMLInputElement | null>(null);
const workState = ref<workState>(props.child.workState ?? 'idle');
const currentIcon = ref<iconList>('bean:play');
const beansToPayout = computed(
  () =>
    useSession()
      .get()
      ?.stations.get(props.stationId)
      ?.children.get(props.child.id)?.numberOfBeansToPayout ?? '-',
);

const sessionIcon = ref<string>('');
const tickCounter = ref(0);
const timeResting = ref('00:00');

onMounted(() => {
  setIconBasedOnWorkingState();
  sessionIcon.value = getCookie('bean_icon') || DEFAULT_ICON;
  calculateBeans(props.child);

  const interval = setInterval(() => {
    updateChildProps(props.child, timeResting);
    console.log('interval');
  }, INTERVAL_TIME_TIMER * 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

watch(
  () => props.lastHeaderUpdate,
  (newValue) => {
    if (newValue === 'start' || newValue === 'stop') {
      ticksPassed = 0;
      tickCounter.value = 0;
      props.child.workState = newValue === 'start' ? 'working' : 'resting';
      setIconBasedOnWorkingState();
      emit('update:work-state', props.child.workState);
    } else if (newValue === 'reset') {
      resetChild();
    }
  },
);

watch(
  () => props.child,
  (newChild) => {
    if (newChild) {
      setIconBasedOnWorkingState();
      console.log(newChild);
    }
  },
);

function updateChildProps(child: Child, timeResting: Ref<string>) {
  if (props.child.workState === 'resting') {
    calculateRestingTimer(child, timeResting);
  } else if (props.child.workState === 'working') {
    calculateBeans(child);
  }
}

function calculateRestingTimer(child: Child, timeResting: Ref<string>) {
  const lastCheckoutTime = child.lastCheckout
    ? new Date(child.lastCheckout).getTime()
    : new Date().getTime();
  const timeDifference = new Date().getTime() - lastCheckoutTime;
  const minutes = Math.floor(timeDifference / 60000);
  const seconds = Math.floor((timeDifference % 60000) / 1000);
  timeResting.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function calculateBeans(child: Child) {
  try {
    const lastCheckin = child.lastCheckin
      ? new Date(child.lastCheckin).getTime()
      : new Date().getTime();
    const currentTime = new Date().getTime();
    const timeSinceLastCheckin = Math.floor(
      (currentTime - lastCheckin) / 1000 + (child?.storedTimeForNextBean ?? 0),
    );

    const secondsPerTick =
      useSession().get()?.secondsPerTick ?? DEFAULT_SECONDS_PER_TICK;
    const beansPerTick =
      useSession().get()?.beansPerTick ?? DEFAULT_BEANS_PER_TICK;

    const totalTicksPassed = Math.floor(timeSinceLastCheckin / secondsPerTick);
    const bonusTimeForNextBean = timeSinceLastCheckin % secondsPerTick;

    useSession()
      .get()!
      .stations.get(props.stationId)!
      .children.get(child.id)!.storedTimeForNextBean = bonusTimeForNextBean;

    const beansToAdd = totalTicksPassed - ticksPassed;
    if (beansToAdd > 0) {
      useSession().addBeans(
        props.stationId,
        child.id,
        beansToAdd * beansPerTick,
      );
      ticksPassed += beansToAdd;
    }
  } catch (error) {
    console.error('Error calculating payout: (' + child?.id + ')', error);
  }
  return child!;
}

function resetChild() {
  ticksPassed = 0;
  tickCounter.value = 0;
  props.child.workState = 'idle';
  currentIcon.value = 'bean:play';
  timeResting.value = '00:00';
  emit('update:work-state', props.child.workState);
}

function toggleIcon() {
  if (!props.isUnstable) {
    ticksPassed = 0;
    tickCounter.value = 0;
    if (currentIcon.value === 'bean:stop') {
      currentIcon.value = 'bean:play';
      props.child.workState = 'resting';
      timeResting.value = '00:00';
    } else {
      currentIcon.value = 'bean:stop';
      props.child.workState = 'working';
    }
    emit('update:work-state', props.child.workState);
  }
}

function setIconBasedOnWorkingState() {
  if (props.child.workState === 'working') {
    currentIcon.value = 'bean:stop';
  } else {
    currentIcon.value = 'bean:play';
  }
}

function handleSwipeAction(optionIndex: number) {
  if (props.isUnstable) return;
  switch (optionIndex) {
    case 0:
      break;
    case 1:
      resetChild();
      break;
    case 2:
      useSession().removeChild(props.stationId, props.child.id);
      break;
    default:
      console.warn('Unknown swipe option index:', optionIndex);
  }
}
</script>

<template>
  <li
    class="relative flex h-12 w-full place-content-center place-items-center border-t border-t-gray-300"
  >
    <gesture-swipe
      :duration="300"
      :option1="
        new swipeOption('bean:edit-light', 'bg-blue-500 text-white', 'Edit')
      "
      :option2="
        new swipeOption('bean:reset', 'bg-orange-400 text-white', 'Reset')
      "
      :option3="
        new swipeOption('bean:trash-light', 'bg-red-500 text-white', 'Delete')
      "
      :is-unstable="isUnstable"
      @option-click="handleSwipeAction"
    >
      <div
        class="grid h-full w-full grid-cols-3 place-content-center place-items-center bg-bean-white-400 px-2"
      >
        <div
          class="flex h-full w-full place-content-start place-items-center pl-1"
        >
          <input
            ref="childEditRef"
            :value="child.name"
            class="text-apply-p w-full truncate bg-bean-white-400 text-left"
          />
        </div>
        <div class="flex w-full place-content-center place-items-center">
          <button
            class="flex h-fit w-fit cursor-pointer place-content-center place-items-center rounded-xl p-1"
            :class="[
              currentIcon === 'bean:play' ? 'bg-green-500' : 'bg-red-500',
            ]"
            type="button"
          >
            <icon :name="currentIcon" class="size-6"></icon>
          </button>
        </div>
        <div
          class="col-start-3 flex h-full w-full place-content-end place-items-center pr-1"
        >
          <p v-if="child.workState !== 'resting'">
            {{ isUnstable ? '-' : beansToPayout }}
            {{ ' ' + sessionIcon }}
          </p>
          <p v-else>{{ timeResting }}</p>
        </div>
      </div>
      <div
        @click="toggleIcon"
        id="overlay-unstable"
        :class="{
          'bg-gray-500/15':
            currentIcon === 'bean:play' && child.workState !== 'idle',
        }"
        class="absolute bottom-[3px] left-0 right-0 top-[3px] rounded-lg"
      />
      <div
        id="overlay-unstable"
        v-if="isUnstable"
        class="absolute bottom-1 left-0 right-0 top-1 rounded-lg bg-gray-500/15"
      />
    </gesture-swipe>
  </li>
</template>

<style scoped></style>
