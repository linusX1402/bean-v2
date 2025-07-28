<script setup lang="ts">
import StationDetail from '~/components/station/station-detail.vue';
import type { BeanStation } from '~/models/bean-station';
import Login from '~/pages/login.vue';

const props = withDefaults(
  defineProps<{
    station: BeanStation;
    isUnstable?: boolean;
  }>(),
  { isUnstable: false },
);

const emit = defineEmits(['update:open-detail', 'update:close-detail']);
const isDetailOpen = ref<boolean>(false);

// ROUTING
// const route = useRoute();
// onMounted(() => {
//   if (
//     route.params.slug.length >= 3 &&
//     route.params.slug[2] === props.station.name.toLowerCase()
//   ) {
//     toggleDetail();
//   }
// });

function getWorkingChildrenCount(station: BeanStation): number {
  try {
    return Array.from(station.children.values()).filter(
      (child) => child.workState === 'working',
    ).length;
  } catch (e: any) {
    console.warn('failed to get working children', e);
  }
  return 0;
}

function getTotalBeansEarned(station: BeanStation): number {
  return Array.from(station.children.values()).reduce(
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
    // isDetailOpen.value
    //   ? emit('update:open-detail', props.station.name)
    //   : emit('update:close-detail', props.station.name);
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
      <li>children: {{ station.children?.size ?? 0 }}</li>
      <li>working: {{ getWorkingChildrenCount(station) }}</li>
      <li>total Beans Earned: {{ station.children?.size ?? 0 }}</li>
    </ul>
    <div
      v-if="isUnstable"
      id="overlay"
      class="absolute bottom-0 left-0 right-0 top-0 rounded-b-2xl bg-gray-500/15"
    ></div>
  </div>
  <transition name="detail" mode="in-out">
    <station-detail
      :station="station"
      class="fixed left-0 top-0 z-30 h-screen w-screen overflow-y-auto"
      v-if="isDetailOpen"
      @update:close-detail="toggleDetail"
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
