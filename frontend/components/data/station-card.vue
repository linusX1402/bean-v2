<script setup lang="ts">
import StationDetail from '~/components/data/station-detail.vue';

const props = defineProps<{
  station: Station;
}>();

const isDetailOpen = ref<boolean>(false);

function getWorkingChildrenCount(station: Station): number {
  return station.children.filter((child) => child.workState === 'working')
    .length;
}

function getTotalBeansEarned(station: Station): number {
  return station.children.reduce(
    (total, child) => total + child.numberOfBeansEarned,
    0,
  );
}
function toggleDetail() {
  isDetailOpen.value = !isDetailOpen.value;
  document.body.style.overflow = 'hidden';
}
</script>

<template>
  <div
    class="flex aspect-square w-60 cursor-pointer flex-col gap-4 rounded-2xl border-t-[20px] bg-white/75 p-6"
    :style="'border-top-color: ' + props.station.hexColor"
    @click="toggleDetail"
  >
    <h6 class="w-full text-center">{{ station.name }}</h6>
    <ul>
      <li>children: {{ station.children.length }}</li>
      <li>working: {{ getWorkingChildrenCount(station) }}</li>
      <li>total Beans Earned: {{ station.children.length }}</li>
    </ul>
  </div>
  <transition name="detail" mode="in-out">
    <station-detail
      @close-detail="toggleDetail"
      :station="station"
      class="fixed left-0 top-0 z-10 h-screen w-screen overflow-y-auto"
      v-if="isDetailOpen"
    />
  </transition>
</template>

<style scoped>
.detail-enter-active,
.detail-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.detail-enter-from {
  transform: translateX(100%);
}

.detail-enter-to {
  transform: translateX(0);
}

.detail-leave-from {
  transform: translateX(0);
}

.detail-leave-to {
  transform: translateX(100%);
}
</style>
