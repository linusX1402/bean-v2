<script setup lang="ts">
import type Child from '~/composables/child';
const props = defineProps<{ child: Child }>();
</script>

<template>
  <li
    class="flex h-10 w-full place-content-start place-items-center border-t border-t-gray-300 px-2"
  >
    <p>
      {{ child.name }}
    </p>
  </li>
</template>

<style scoped></style>
