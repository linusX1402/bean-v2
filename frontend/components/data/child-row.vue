<script setup lang="ts">
import type Child from '~/models/child';
import { getCookie } from 'typescript-cookie';
import { iconList } from '~/types/types';

const props = withDefaults(
  defineProps<{
    child: Child;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

// const { $websocket } = useNuxtApp<{ websocket: Websocked }>();

const currentIcon = ref<iconList>('bean:play');
const workingState = ref<workingState>('idle');

type workingState = 'working' | 'idle' | 'resting';
type iconList = 'bean:play' | 'bean:stop';
0;

const sessionIcon = ref<string>('');

onMounted(() => {
  sessionIcon.value = getCookie('bean_icon') || '🫘';
});

function toggleIcon() {
  if (currentIcon.value === 'bean:stop') {
    currentIcon.value = 'bean:play';
    workingState.value = 'resting';
    // $websocket.send('message');
  } else {
    currentIcon.value = 'bean:stop';
    workingState.value = 'idle';
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
        <p>
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
        <p>
          {{ isUnstable ? '-' : child.numberOfBeansToPayout }}
          {{ ' ' + sessionIcon }}
        </p>
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
        'bg-gray-500/15':
          currentIcon === 'bean:play' && workingState !== 'idle',
      }"
      class="absolute bottom-[3px] left-0 right-0 top-[3px] rounded-lg"
    />
  </li>
</template>

<style scoped></style>
