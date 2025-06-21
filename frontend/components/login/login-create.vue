<script setup lang="ts">
import {
  BEANS_PER_TICK_STEP_SIZE,
  DEFAULT_BEANS_PER_TICK,
  DEFAULT_ICON,
  DEFAULT_SECONDS_PER_TICK,
  DEFAULT_STARTING_FUNDS,
  ICON_LIST,
  MAX_BEANS_PER_TICK,
  MAX_SECONDS_PER_TICK,
  MAX_STARTING_FUNDS,
  MIN_BEANS_PER_TICK,
  MIN_SECONDS_PER_TICK,
  MIN_STARTING_FUNDS,
  SECONDS_PER_TICK_STEP_SIZE,
  STARTING_FUNDS_STEP_SIZE,
} from '~/constants/constants';
import Stepper from '~/components/form/stepper.vue';
import type NewBeanSessionDTO from '~/models/new-bean-session-dto';

type BeanSessionError = {
  name: boolean;
  icon: boolean;
  stations: boolean;
  secondsPerTick: boolean;
  beanPerTick: boolean;
  startingFunds: boolean;
};

enum loginViews {
  join = 0,
  create = 1,
  copy = 2,
}

const props = defineProps<{
  currentView: loginViews;
  doForwardUser: boolean;
  apiError: boolean;
}>();

const emit = defineEmits([
  'update:change-view',
  'update:submit-create',
  'update:forward-user',
]);

const doForwardUserComponent = ref(props.doForwardUser);
const newSession = ref<NewBeanSessionDTO>({
  name: '',
  icon: DEFAULT_ICON,
  secondsPerTick: DEFAULT_SECONDS_PER_TICK,
  beansPerTick: DEFAULT_BEANS_PER_TICK,
  startingFunds: DEFAULT_STARTING_FUNDS,
});

const newSessionError = ref<BeanSessionError>({
  name: false,
  icon: false,
  stations: false,
  secondsPerTick: false,
  beanPerTick: false,
  startingFunds: false,
});

const scrollDivOnOpen = ref<HTMLElement | undefined>(undefined);

function submitCreate() {
  emit('update:submit-create', newSession.value);
  emit('update:forward-user', doForwardUserComponent.value);
}

function updateSessionProperty(
  property: keyof NewBeanSessionDTO,
  operation: 'add' | 'subtract',
  value: number = 1,
) {
  if (
    newSession.value[property] !== undefined &&
    (property === 'beansPerTick' ||
      property === 'secondsPerTick' ||
      property === 'startingFunds')
  ) {
    if (
      operation === 'add' &&
      newSession.value[property] + value >= getMinValue(property) &&
      newSession.value[property] + value <= getMaxValue(property)
    ) {
      newSession.value[property] += value;
    } else if (
      operation === 'subtract' &&
      newSession.value[property] - value >= getMinValue(property) &&
      newSession.value[property] - value <= getMaxValue(property)
    ) {
      newSession.value[property] -= value;
    }
  }
}

function getMaxValue(property: keyof NewBeanSessionDTO): number {
  switch (property) {
    case 'beansPerTick':
      return MAX_BEANS_PER_TICK;
    case 'secondsPerTick':
      return MAX_SECONDS_PER_TICK;
    case 'startingFunds':
      return MAX_STARTING_FUNDS;
    default:
      return -1;
  }
}

function getMinValue(property: keyof NewBeanSessionDTO): number {
  switch (property) {
    case 'beansPerTick':
      return MIN_BEANS_PER_TICK;
    case 'secondsPerTick':
      return MIN_SECONDS_PER_TICK;
    case 'startingFunds':
      return MIN_STARTING_FUNDS;
    default:
      return -1;
  }
}

const timePerTick = computed(() => {
  const minutes = Math.floor(newSession.value.secondsPerTick / 60);
  const seconds = newSession.value.secondsPerTick % 60;
  return seconds !== 0 ? `${minutes},5 min` : `${minutes} min`;
});

function scrollToAddStationCard(delay: number = 0) {
  setTimeout(() => {
    if (addStationRef.value) {
      addStationRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, delay);
}
</script>

<template>
  <form
    v-if="currentView === loginViews.create"
    class="flex h-fit min-h-full flex-col place-content-between place-items-center gap-8"
    @submit.prevent="submitCreate"
  >
    <div
      class="flex w-full flex-col place-content-center place-items-center gap-8"
    >
      <h4>Create a Session</h4>
      <div class="flex w-full flex-col gap-3">
        <div class="flex w-full flex-col gap-2">
          <div class="w-full">
            <label for="sessionId" class="w-full">Session Name:</label>
            <form-text
              :max-length="50"
              v-model="newSession.name"
              :is-required="true"
              name="sessionId"
              placeholder="Session Name"
            />
            <label
              for="sessionId"
              v-if="newSessionError.name || apiError"
              class="text-red-500"
            >
              Invalid Session name!
            </label>
          </div>
        </div>
        <div class="flex w-full place-content-start place-items-center gap-2">
          <label for="icon">icon:</label>
          <div>
            <select
              name="icon"
              v-model="newSession.icon"
              class="h-fit w-full rounded-md border border-solid border-black/50 p-1"
            >
              <option v-for="i in ICON_LIST" :value="i">{{ i }}</option>
            </select>
          </div>
        </div>
        <div
          class="flex w-full place-content-between place-items-center md:gap-5"
        >
          <label>Beans Per Tick: {{ newSession.beansPerTick }}</label>
          <stepper
            @update:add="
              updateSessionProperty(
                'beansPerTick',
                'add',
                BEANS_PER_TICK_STEP_SIZE,
              )
            "
            @update:subtract="
              updateSessionProperty(
                'beansPerTick',
                'subtract',
                BEANS_PER_TICK_STEP_SIZE,
              )
            "
          />
        </div>
        <div
          class="flex w-full place-content-between place-items-center md:gap-5"
        >
          <label>Starting funds: {{ newSession.startingFunds }}</label>
          <stepper
            @update:add="
              updateSessionProperty(
                'startingFunds',
                'add',
                STARTING_FUNDS_STEP_SIZE,
              )
            "
            @update:subtract="
              updateSessionProperty(
                'startingFunds',
                'subtract',
                STARTING_FUNDS_STEP_SIZE,
              )
            "
          />
        </div>
        <div
          class="flex w-full place-content-between place-items-center md:gap-5"
        >
          <label>Seconds Per Tick: {{ timePerTick }}</label>
          <stepper
            @update:add="
              updateSessionProperty(
                'secondsPerTick',
                'add',
                SECONDS_PER_TICK_STEP_SIZE,
              )
            "
            @update:subtract="
              updateSessionProperty(
                'secondsPerTick',
                'subtract',
                SECONDS_PER_TICK_STEP_SIZE,
              )
            "
          />
        </div>
        <div class="flex w-full place-content-start place-items-center gap-2">
          <label for="stay-signed-in">Stay signed in</label>
          <input
            name="stay-signed-in"
            class="size-4"
            type="checkbox"
            v-model="doForwardUserComponent"
          />
        </div>
      </div>
    </div>
    <div
      class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
    >
      <ui-button
        @click="emit('update:change-view', loginViews.join)"
        :style="'secondary'"
        :type="'button'"
        >join</ui-button
      >
      <ui-button :style="'primary'" :type="'submit'">create</ui-button>
    </div>
    <div ref="scrollDivOnOpen" />
  </form>
</template>

<style scoped></style>
