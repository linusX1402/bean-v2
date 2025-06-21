<script setup lang="ts">
import { loginViews, PLACEHOLDERS } from '~/constants/constants';

const props = defineProps<{
  currentView: loginViews;
  doForwardUser: boolean;
  apiError: boolean;
}>();

const emit = defineEmits([
  'update:change-view',
  'update:submit-login',
  'update:forward-user',
]);

const sessionNameInput = ref<string>('');
const sessionNameInputError = ref<boolean>(false);
const doForwardUserComponent = ref<boolean>(props.doForwardUser);

function getGamePlaceholder() {
  return PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
}

function submitLogin() {
  emit('update:submit-login', sessionNameInput.value);
  emit('update:forward-user', doForwardUserComponent.value);
}
</script>

<template>
  <form
    v-if="currentView === loginViews.join"
    class="flex h-full flex-col place-content-between place-items-center gap-8"
    @submit.prevent="submitLogin"
  >
    <div
      class="flex w-full flex-col place-content-center place-items-center gap-8"
    >
      <h4>Join a Session</h4>
      <div class="w-full">
        <label class="w-full">Session ID / Session Name: </label>
        <label class="text-red-500" v-if="sessionNameInputError || apiError"
          >No session with this id was found</label
        >
        <form-text
          v-model="sessionNameInput"
          :is-required="true"
          name="sessionId"
          :placeholder="getGamePlaceholder()"
        />
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
    <div
      class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
    >
      <ui-button
        @click="emit('update:change-view', loginViews.create)"
        :style="'secondary'"
        :type="'button'"
        >create</ui-button
      >
      <ui-button :style="'primary'" :type="'submit'">submit</ui-button>
    </div>
  </form>
</template>

<style scoped></style>
