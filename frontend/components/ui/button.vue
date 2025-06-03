<script setup lang="ts">
const props = defineProps<{
  type: 'button' | 'submit' | 'reset';
  style: 'primary' | 'secondary';
}>();

const optionalClasses = {
  primary:
    'bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-500 hover:border-blue-600',
  secondary: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
};
</script>

<template>
  <button
    :type="type"
    class="box-border w-full rounded-md px-4 py-1 text-center"
    :class="optionalClasses[style]"
  >
    <slot />
  </button>
</template>

<style scoped></style>
