<script setup lang="ts">
import StationDetail from '~/components/data/station-detail.vue';
import type { BeanStation } from '../../../models/bean-station';

const props = withDefaults(
  defineProps<{
    station: BeanStation;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

const isDetailOpen = ref<boolean>(false);

function getWorkingChildrenCount(station: BeanStation): number {
  return station.children.filter((child) => child.workState === 'working')
    .length;
}

function getTotalBeansEarned(station: BeanStation): number {
  return station.children.reduce(
    (total, child) => total + child.numberOfBeansEarned,
    0,
  );
}

function toggleDetail() {
  if (!props.isUnstable) {
    isDetailOpen.value = !isDetailOpen.value;
    if (isDetailOpen.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
}
</script>

<template>
  <div
    class="relative flex aspect-square w-60 flex-col gap-4 rounded-2xl border-t-[20px] bg-bean-white-400 p-6"
    :class="{ 'cursor-pointer select-none': !isUnstable }"
    :style="'border-top-color: ' + props.station.hexColor"
    @click="toggleDetail"
  >
    <h6 class="w-full text-center">{{ station.name }}</h6>
    <ul>
      <li>children: {{ station.children.length }}</li>
      <li>working: {{ getWorkingChildrenCount(station) }}</li>
      <li>total Beans Earned: {{ station.children.length }}</li>
    </ul>
    <div
      v-if="isUnstable"
      id="overlay"
      class="absolute bottom-0 left-0 right-0 top-0 rounded-b-2xl bg-gray-500/15"
    ></div>
  </div>
  <transition name="detail" mode="in-out">
    <station-detail
      @close-detail="toggleDetail"
      :station="station"
      class="fixed left-0 top-0 z-30 h-screen w-screen overflow-y-auto"
      v-if="isDetailOpen"
    />
  </transition>
</template>

<style scoped>
.detail-enter-active,
.detail-leave-active {
  transition: transform 0.125s ease-in-out;
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
