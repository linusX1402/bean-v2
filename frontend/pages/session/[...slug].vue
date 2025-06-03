<script setup lang="ts">
const route = useRoute();
const sessionId = ref<string | undefined>(undefined);

onMounted(() => {
  const slug = route.params.slug as string;
  if (slug) {
    sessionId.value = slug;
    console.log(slug);
  } else {
    console.error('No session ID found in the route parameters.');
  }
});
</script>

<template></template>

<style scoped></style>
