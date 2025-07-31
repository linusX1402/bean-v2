<script setup lang="ts">
import { dashboardViews, DEFAULT_ICON } from '../../constants/constants';

const props = defineProps<{ isEditing: boolean; variant: dashboardViews }>();

const emit = defineEmits([
  'update:logout',
  'update:toggle-edit',
  'update:add-station',
]);

function logout() {
  emit('update:logout');
}
function toggleEdit() {
  emit('update:toggle-edit', !props.isEditing);
}
function addStation() {
  emit('update:add-station');
}
</script>

<template>
  <header
    class="grid w-full grid-cols-3 place-content-center place-items-center border-b border-b-gray-400 bg-bean-white-400 p-2 py-4 text-center"
  >
    <div
      class="col-start-1 row-start-1 flex h-full min-h-7 w-full place-content-start place-items-center pr-2 md:hidden"
    >
      <button
        class="flex cursor-pointer place-content-center place-items-center text-blue-500"
        @click="logout"
      >
        <LazyIcon class="size-7 -scale-x-100" name="bean:exit" />
      </button>
    </div>
    <div
      class="col-start-3 flex h-full min-h-7 w-full place-content-end place-items-center pr-2 md:hidden"
    >
      <button
        class="flex cursor-pointer place-content-center place-items-center text-blue-500"
        @click="toggleEdit()"
        v-if="!isEditing"
      >
        <LazyIcon class="size-7" name="bean:plus-blue" />
      </button>
      <button
        class="flex cursor-pointer place-content-center place-items-center text-blue-500"
        @click="addStation"
        v-else
      >
        <p class="text-p text-blue-500">submit</p>
      </button>
    </div>
    <h2 v-if="variant === dashboardViews.home" class="col-span-3 text-nowrap">
      Bean-Counter {{ DEFAULT_ICON }}
    </h2>
    <h2
      v-else-if="variant === dashboardViews.share"
      class="col-span-3 text-nowrap"
    >
      Share
    </h2>
    <h2 v-else class="col-span-3 text-nowrap">Settings</h2>
  </header>
</template>

<style scoped></style>
