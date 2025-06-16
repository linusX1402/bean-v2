<script setup lang="ts">
const props = defineProps<{
  currentPage: page;
}>();

enum page {
  loading = 0,
  home = 1,
  share = 2,
  settings = 3,
}
const emit = defineEmits(['update:logout', 'update:set-page']);

function logout() {
  emit('update:logout', true);
}

function setPage(page: page) {
  emit('update:set-page', page);
}
</script>

<template>
  <footer
    class="sm:p fixed bottom-0 left-0 z-20 flex h-[72px] w-screen place-content-around place-items-center border-t border-t-gray-400 bg-bean-white-400 px-10 sm:h-screen sm:w-[72px] sm:flex-col sm:border-r sm:border-r-gray-400 sm:px-0 sm:py-10 md:place-content-start md:gap-16 md:pt-6 lg:pt-10"
  >
    <div class="flex place-content-center place-items-center rounded-xl p-2">
      <button
        class="flex cursor-pointer place-content-center place-items-center text-blue-500"
        @click="logout"
      >
        <LazyIcon class="size-8 -scale-x-100" name="bean:exit" />
      </button>
    </div>

    <div
      :class="[currentPage === page.home ? 'bg-blue-600' : 'bg-black/10']"
      class="flex place-content-center place-items-center rounded-xl p-2"
    >
      <LazyIcon
        :name="currentPage === page.home ? 'bean:home-light' : 'bean:home-dark'"
        class="aspect-square size-8 cursor-pointer"
        @click="setPage(page.home)"
      />
    </div>
    <div
      :class="[currentPage === page.share ? 'bg-blue-600' : 'bg-black/10']"
      class="flex place-content-center place-items-center rounded-xl p-2"
    >
      <LazyIcon
        :name="
          currentPage === page.share ? 'bean:share-light' : 'bean:share-dark'
        "
        class="aspect-square size-8 cursor-pointer"
        @click="setPage(page.share)"
      />
    </div>
    <div
      :class="[currentPage === page.settings ? 'bg-blue-600' : 'bg-black/10']"
      class="flex place-content-center place-items-center rounded-xl p-2"
    >
      <LazyIcon
        :name="
          currentPage === page.settings
            ? 'bean:settings-light'
            : 'bean:settings-dark'
        "
        class="aspect-square size-8 cursor-pointer"
        @click="setPage(page.settings)"
      />
    </div>
  </footer>
</template>

<style scoped></style>
