<script setup lang="ts">
import type Child from '~/models/child';
import { getCookie } from 'typescript-cookie';
import {
  DEFAULT_BEANS_PER_TICK,
  DEFAULT_ICON,
  DEFAULT_SECONDS_PER_TICK,
  type iconList,
  type workingState as workState,
} from '~/constants/constants';

const props = withDefaults(
  defineProps<{
    child: Child;
    stationId: number;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

const emit = defineEmits(['update:work-state']);

let ticksPassed = 0;
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
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

function updateChildProps(child: Child, timeResting: Ref<string>) {
  if (workState.value === 'resting') {
    calculateRestingTimer(child, timeResting);
  } else if (workState.value === 'working') {
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

function toggleIcon() {
  if (!props.isUnstable) {
    ticksPassed = 0;
    tickCounter.value = 0;
    if (currentIcon.value === 'bean:stop') {
      currentIcon.value = 'bean:play';
      workState.value = 'resting';
      timeResting.value = '00:00';
    } else {
      currentIcon.value = 'bean:stop';
      workState.value = 'working';
    }
    emit('update:work-state', workState.value);
  }
}

function setIconBasedOnWorkingState() {
  if (workState.value === 'working') {
    currentIcon.value = 'bean:stop';
  } else {
    currentIcon.value = 'bean:play';
  }
}
</script>

<template>
  <li
    class="relative flex h-12 w-full place-content-center place-items-center border-t border-t-gray-300 px-2"
  >
    <div
      class="grid w-full grid-cols-3 place-content-center place-items-center"
    >
      <div
        class="flex h-full w-full place-content-start place-items-center pl-1"
      >
        <p class="w-full truncate text-left">
          {{ child.name }}
        </p>
      </div>
      <div class="flex w-full place-content-center place-items-center">
        <button
          class="flex h-fit w-fit cursor-pointer place-content-center place-items-center rounded-xl p-1"
          :class="[currentIcon === 'bean:play' ? 'bg-green-500' : 'bg-red-500']"
          type="button"
        >
          <icon :name="currentIcon" class="size-6"></icon>
        </button>
      </div>
      <div
        class="col-start-3 flex h-full w-full place-content-end place-items-center pr-1"
      >
        <p v-if="workState !== 'resting'">
          {{ isUnstable ? '-' : beansToPayout }}
          {{ ' ' + sessionIcon }}
        </p>
        <p v-else>{{ timeResting }}</p>
      </div>
    </div>

    <div
      id="overlay-unstable"
      v-if="isUnstable"
      class="absolute bottom-1 left-0 right-0 top-1 rounded-lg bg-gray-500/15"
    />
    <div
      @click="toggleIcon"
      id="overlay-unstable"
      :class="{
        'bg-gray-500/15': currentIcon === 'bean:play' && workState !== 'idle',
      }"
      class="absolute bottom-[3px] left-0 right-0 top-[3px] rounded-lg"
    />
  </li>
</template>

<style scoped></style>
