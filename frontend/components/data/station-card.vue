<script setup lang="ts">
const props = defineProps<{
  station: Station;
}>();
</script>

<template>
  <div
    class="flex aspect-square w-60 flex-col gap-4 rounded-xl p-6"
    :style="'background-color:' + props.station.hexColor + 80"
  >
    <h6 class="w-full text-center">{{ station.name }}</h6>
    <ul>
      <li>children: {{ station.children.length }}</li>
    </ul>
  </div>
</template>

<style scoped>
a {
  background-color: rgba(18, 52, 86, 0.5);
}
</style>
