<script setup lang="ts">
import ChildRow from '~/components/data/child-row.vue';

const props = defineProps<{ station: Station }>();

const emit = defineEmits<{
  (e: 'closeDetail'): void;
}>();
</script>

<template>
  <section class="flex h-full w-full flex-col gap-12 bg-bean-white-500">
    <header
      class="text-blue grid grid-cols-3 place-content-center place-items-center gap-y-2 border-b border-b-black/20 bg-white/60 p-2 py-4 pt-4 text-center"
    >
      <div
        class="flex h-full w-full place-content-start place-items-center pl-2"
      >
        <button
          @click="$emit('closeDetail')"
          class="flex place-content-center place-items-center text-blue-500"
        >
          <LazyIcon name="bean:chevron-left-blue" class="size-7" />
          <p class="text-p">Back</p>
        </button>
      </div>
      <h3 class="col-span-3">{{ station.name }}</h3>
    </header>
    <main>
      <div class="w-full px-8">
        <ul class="w-full rounded-2xl bg-bean-white-400 p-2">
          <li
            class="flex w-fit place-content-center place-items-center gap-2 px-2 font-semibold text-gray-400"
          >
            Children
          </li>
          <child-row
            v-for="child in station.children"
            :child="child"
          ></child-row>
        </ul>
      </div>
    </main>
  </section>
</template>

<style scoped></style>
