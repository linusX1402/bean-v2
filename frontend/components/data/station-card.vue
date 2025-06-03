<script setup lang="ts">
const props = defineProps<{
  station: Station;
}>();

function getWorkingChildrenCount(station: Station): number {
  return station.children.filter((child) => child.isWorking).length;
}

function getTotalBeansEarned(station: Station): number {
  return station.children.reduce(
    (total, child) => total + child.numberOfBeansEarned,
    0,
  );
}
</script>

<template>
  <div
    class="flex aspect-square w-60 flex-col gap-4 rounded-xl p-6"
    :style="'background-color:' + props.station.hexColor + 80"
  >
    <h6 class="w-full text-center">{{ station.name }}</h6>
    <ul>
      <li>children: {{ station.children.length }}</li>
      <li>working: {{ getWorkingChildrenCount(station) }}</li>
      <li>total Beans Earned: {{ station.children.length }}</li>
    </ul>
  </div>
</template>

<style scoped>
a {
  background-color: rgba(18, 52, 86, 0.5);
}
</style>
