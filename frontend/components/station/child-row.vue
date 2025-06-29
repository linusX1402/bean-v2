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
import useBeanCalculation from '~/composables/bean-calculation';
import Login from '~/pages/login.vue';

const props = withDefaults(
  defineProps<{
    child: Child;
    stationId: number;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

const emit = defineEmits(['update:work-state']);

const workState = ref<workState>(props.child.workState ?? 'idle');
const currentIcon = ref<iconList>('bean:play');
const beansToPayout = computed(
  () =>
    useSession()
      .get()
      ?.stations.find((s) => s.id === props.stationId)
      ?.children.find((c) => c.id === props.child.id)?.numberOfBeansToPayout ??
    '-',
);

const sessionIcon = ref<string>('');
const tickCounter = ref(0);
const timeResting = ref('00:00');

onMounted(() => {
  setIconBasedOnWorkingState();
  sessionIcon.value = getCookie('bean_icon') || DEFAULT_ICON;

  let isFirstLoopAfterInit = true;

  const interval = setInterval(() => {
    if (workState.value === 'resting') {
      calculateRestingTimer(props.child, timeResting);
    } else if (workState.value === 'working') {
      timeResting.value = '00:00';
      const timeSinceLastCheckin =
        Math.floor(
          (new Date().getTime() -
            (props.child.lastCheckin?.getTime() || new Date().getTime())) /
            1000,
        ) + (props.child.storedTimeForNextBean ?? 0);
      const secondsPerTick =
        useSession().get()?.secondsPerTick || DEFAULT_SECONDS_PER_TICK;
      const beansPerTick =
        useSession().get()?.beansPerTick || DEFAULT_BEANS_PER_TICK;
      // console.log('storedTimeForNextBean: ', props.child.storedTimeForNextBean);
      console.log('timeSinceLastCheckin', timeSinceLastCheckin);
      console.log(props.child.lastCheckin);
      // console.log(timeSinceLastCheckin / secondsPerTick);
      // console.log('child: ', props.child);
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
          useSession().addBeans(props.stationId, props.child.id, beansToAdd);
        } catch (error) {
          console.error('Error updating child beans:', error);
        }
      }
    }
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

function calculateRestingTimer(child: Child, timeResting: Ref<string>) {
  const timeDifference =
    new Date().getTime() -
    (child.lastCheckout?.getTime() || new Date().getTime());
  const minutes = Math.floor(timeDifference / 60000);
  const seconds = Math.floor((timeDifference % 60000) / 1000);
  timeResting.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleIcon() {
  if (!props.isUnstable) {
    if (currentIcon.value === 'bean:stop') {
      currentIcon.value = 'bean:play';
      workState.value = 'resting';
      tickCounter.value = 0;
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
