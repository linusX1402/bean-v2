<script setup lang="ts">
const props = defineProps<{
  type: 'button' | 'submit' | 'reset';
  style: 'primary' | 'secondary';
}>();

const optionalClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
};
</script>

<template>
  <button
    :type="type"
    class="w-full rounded-md px-8 py-1"
    :class="optionalClasses[style]"
  >
    <slot />
  </button>
</template>

<style scoped></style>
