<script setup lang="ts">
const props = defineProps<{ type: 'button' | 'submit' | 'reset' }>();
</script>

<template>
  <button :type="type"></button>
</template>

<style scoped></style>
