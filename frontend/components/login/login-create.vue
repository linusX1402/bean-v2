<script setup lang="ts">
import type BeanSessionDTO from '~/models/bean-session-dto';
import {
  DEFAULT_BEANS_PER_TICK,
  DEFAULT_ICON,
  DEFAULT_SECONDS_PER_TICK,
  DEFAULT_STARTING_FUNDS,
  ICON_LIST,
} from '~/constants/constants';

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
}>();
const emit = defineEmits([
  'update:change-view',
  'update:submit-create',
  'update:forward-user',
]);

const doForwardUserComponent = ref(props.doForwardUser);
const newSession = ref<BeanSessionDTO>({
  name: '',
  icon: DEFAULT_ICON,
  stations: [],
  sessionIdAdmin: '',
  sessionIdEditor: '',
  sessionIdUser: '',
  secondsPerTick: DEFAULT_SECONDS_PER_TICK,
  beanPerTick: DEFAULT_BEANS_PER_TICK,
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

function submitCreate() {
  emit('update:submit-create', newSession.value);
  emit('update:forward-user', doForwardUserComponent.value);
}
</script>

<template>
  <form
    v-if="currentView === loginViews.create"
    class="flex h-full flex-col place-content-between place-items-center gap-8"
    @submit.prevent="submitCreate"
  >
    <div
      class="flex w-full flex-col place-content-center place-items-center gap-8"
    >
      <h4>Create a Session</h4>
      <div class="flex w-full flex-col gap-3">
        <div class="flex w-full flex-col gap-2">
          <div class="w-full">
            <label class="w-full">Session Name:</label>
            <label v-if="newSessionError.name" class="text-red-500">
              Invalid Session name!
            </label>
            <form-text
              :max-length="50"
              v-model="newSession.name"
              :is-required="true"
              name="sessionId"
              placeholder="Session Name"
            />
          </div>
        </div>
        <div class="flex w-full place-content-start place-items-center gap-2">
          <label>icon:</label>
          <div>
            <select
              v-model="newSession.icon"
              class="h-fit w-full rounded-md border border-solid border-black/50 p-1"
            >
              <option v-for="i in ICON_LIST" :value="i">{{ i }}</option>
            </select>
          </div>
        </div>
        <div class="flex w-full place-content-start place-items-center gap-2">
          <label>Stay signed in</label>
          <input
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
  </form>
</template>

<style scoped></style>
