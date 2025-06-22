<script setup lang="ts">
import { dashboardViews } from '~/constants/constants';

const props = defineProps<{
  currentPage: dashboardViews;
}>();

const emit = defineEmits(['update:logout', 'update:set-page']);

function logout() {
  emit('update:logout', true);
}

function setPage(page: dashboardViews) {
  emit('update:set-page', page);
}
</script>

<template>
  <footer
    class="sm:p fixed bottom-0 left-0 z-20 flex h-[72px] w-screen place-content-around place-items-center border-t border-t-gray-400 bg-bean-white-400 px-10 sm:h-screen sm:w-[72px] sm:flex-col sm:border-r sm:border-r-gray-400 sm:px-0 sm:py-10 md:place-content-start md:gap-16 md:pt-6 lg:pt-10"
  >
    <div
      class="hidden place-content-center place-items-center rounded-xl p-2 md:flex"
    >
      <button
        class="flex cursor-pointer place-content-center place-items-center text-blue-500"
        @click="logout"
      >
        <LazyIcon class="size-8 -scale-x-100" name="bean:exit" />
      </button>
    </div>

    <div
      :class="[
        currentPage === dashboardViews.home ? 'bg-blue-600' : 'bg-black/10',
      ]"
      class="flex place-content-center place-items-center rounded-xl p-2"
    >
      <LazyIcon
        :name="
          currentPage === dashboardViews.home
            ? 'bean:home-light'
            : 'bean:home-dark'
        "
        class="aspect-square size-8 cursor-pointer"
        @click="setPage(dashboardViews.home)"
      />
    </div>
    <div
      :class="[
        currentPage === dashboardViews.share ? 'bg-blue-600' : 'bg-black/10',
      ]"
      class="flex place-content-center place-items-center rounded-xl p-2"
    >
      <LazyIcon
        :name="
          currentPage === dashboardViews.share
            ? 'bean:share-light'
            : 'bean:share-dark'
        "
        class="aspect-square size-8 cursor-pointer"
        @click="setPage(dashboardViews.share)"
      />
    </div>
    <div
      :class="[
        currentPage === dashboardViews.settings ? 'bg-blue-600' : 'bg-black/10',
      ]"
      class="flex place-content-center place-items-center rounded-xl p-2"
    >
      <LazyIcon
        :name="
          currentPage === dashboardViews.settings
            ? 'bean:settings-light'
            : 'bean:settings-dark'
        "
        class="aspect-square size-8 cursor-pointer"
        @click="setPage(dashboardViews.settings)"
      />
    </div>
  </footer>
</template>

<style scoped></style>
