<script setup lang="ts">
import type { headerUpdateStates } from '~/constants/constants';

const props = defineProps<{ stationName: string; isEditing: boolean }>();

const currentOpenMenu = ref<headerUpdateStates>('start');
const emit = defineEmits([
  'update:close-detail',
  'update:toggle-edit',
  'update:set-all-children-work-states',
]);

function setHederMenu(to: headerUpdateStates) {
  if (currentOpenMenu.value === to) {
    emit('update:set-all-children-work-states', to);
  }
  currentOpenMenu.value = to;
}

function toggleEdit() {
  emit('update:toggle-edit');
}
</script>

<template>
  <header
    class="text-blue grid grid-cols-3 place-content-center place-items-center gap-y-2 border-b border-b-black/20 bg-white/60 p-2 py-4 pt-4 text-center"
  >
    <div
      class="flex h-full min-h-7 w-full place-content-start place-items-center pl-2"
    >
      <button
        @click="$emit('update:close-detail')"
        class="flex cursor-pointer place-content-center place-items-center text-blue-500"
      >
        <icon name="bean:chevron-left-blue" class="size-7" />
        <p class="text-p">Back</p>
      </button>
    </div>
    <div
      class="col-start-3 flex h-full w-full place-content-end place-items-center pr-2"
    >
      <button
        @click="toggleEdit"
        class="flex place-content-center place-items-center text-blue-500"
      >
        <icon v-if="!isEditing" name="bean:plus-blue" class="size-7" />
        <p v-else class="text-p text-blue-500">submit</p>
      </button>
    </div>
    <h3 class="col-span-3 w-full pl-4 text-start">{{ stationName }}</h3>
  </header>
  <transition-group
    tag="ul"
    name="icon-menu"
    type="transition"
    key="icon-menu"
    class="flex place-content-center place-items-center gap-2"
  >
    <li
      key="menu-start"
      @click="setHederMenu('start')"
      :class="[currentOpenMenu === 'start' ? 'px-3' : 'aspect-square min-w-8']"
      class="flex h-10 cursor-pointer select-none place-content-center place-items-center rounded-xl bg-green-500 p-1 font-semibold transition-all duration-300 ease-in-out"
    >
      <icon name="bean:play" class="size-7" />
      <h6 class="text-white" v-if="currentOpenMenu === 'start'">Start</h6>
    </li>
    <li
      key="menu-stop"
      @click="setHederMenu('stop')"
      :class="[currentOpenMenu === 'stop' ? 'px-3' : 'aspect-square min-w-8']"
      class="flex h-10 cursor-pointer select-none place-content-center place-items-center rounded-xl bg-red-500 p-1 font-semibold text-red-50 transition-all duration-300 ease-in-out"
    >
      <icon name="bean:stop" class="size-7" />
      <h6 class="text-white" v-if="currentOpenMenu === 'stop'">Stop</h6>
    </li>
    <li
      key="menu-reset"
      @click="setHederMenu('reset')"
      :class="[currentOpenMenu === 'reset' ? 'px-3' : 'aspect-square min-w-8']"
      class="flex h-10 cursor-pointer select-none place-content-center place-items-center rounded-xl bg-orange-400 p-1 font-semibold transition-all duration-300 ease-in-out"
    >
      <icon name="bean:reset" class="size-7" />
      <h6 class="text-white" v-if="currentOpenMenu === 'reset'">Reset</h6>
    </li>
  </transition-group>
</template>

<style scoped>
.icon-menu-enter-active,
.icon-menu-leave-active {
  transition: all 0.3s ease-in-out;
}

.icon-menu-enter-from,
.icon-menu-leave-to {
  transform: scaleX(0);
  opacity: 0;
}

.icon-menu-enter-to,
.icon-menu-leave-from {
  transform: scaleX(1);
  opacity: 1;
}
</style>
