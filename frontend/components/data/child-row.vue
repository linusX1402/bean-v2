<script setup lang="ts">
import type Child from '../../../models/child';
import { getCookie } from 'typescript-cookie';

const props = withDefaults(
  defineProps<{
    child: Child;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

const sessionIcon = ref<string>('');

onMounted(() => {
  sessionIcon.value = getCookie('bean_icon') || '🫘';
});
</script>

<template>
  <li
    class="relative flex h-12 w-full place-content-center place-items-center border-t border-t-gray-300 px-2"
  >
    <div
      class="grid w-full grid-cols-3 place-content-center place-items-center"
    >
      <div class="flex h-full w-full place-content-center place-items-center">
        <p>
          {{ child.name }}
        </p>
      </div>
      <div
        class="col-start-3 flex h-full w-full place-content-end place-items-center pr-1"
      >
        <p>{{ child.numberOfBeansToPayout + ' ' + sessionIcon }}</p>
      </div>
    </div>

    <div
      id="overlay"
      v-if="isUnstable"
      class="absolute bottom-1 left-0 right-0 top-1 rounded-lg bg-gray-500/15"
    ></div>
  </li>
</template>

<style scoped></style>
