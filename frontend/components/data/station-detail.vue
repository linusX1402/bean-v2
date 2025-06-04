<script setup lang="ts">
const props = defineProps<{ station: Station }>();
</script>

<template>
  <main>
    <h2>{{ station.name }}</h2>
  </main>
</template>

<style scoped></style>
