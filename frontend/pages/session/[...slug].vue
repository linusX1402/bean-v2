<script setup lang="ts">
import type BeanSession from '../../../models/session';
import StationCard from '~/components/data/station-card.vue';
import type Child from '~/composables/child';

const route = useRoute();
const sessionId = ref<string | undefined>(undefined);
const currentSession = ref<BeanSession | undefined>(undefined);
const stations = ref<Station[]>([]);

enum page {
  home = 0,
  settings = 1,
  share = 2,
}
const currentPage = page.home;

onMounted(async () => {
  const slug = route.params.slug as string;
  if (slug) {
    sessionId.value = slug;
    currentSession.value = await getSessionById(sessionId.value);
    console.log(currentSession.value ? 'found session' : 'No session found');
    console.log(currentSession.value);
  } else {
    console.error('No session ID found in the route parameters.');
  }
});

const testStations = ref<Station[]>([
  new Station(1, '#FF5733', 'Massage Station'),
  new Station(2, '#33FF57', 'Coffee Station'),
  new Station(3, '#3357FF', 'Snacks'),
  new Station(5, '#9B59B6', 'Casino'),
]);

const sampleChildren = ref<Child[]>([]);
stations.value = testStations.value;
</script>

<template>
  <main
    class="relative flex min-h-screen w-full flex-col place-content-between pb-24"
  >
    <div
      class="flex h-fit w-full flex-col place-content-start place-items-center gap-8 sm:pl-[72px]"
    >
      <header
        class="grid w-full grid-cols-3 place-content-center place-items-center border-b border-b-black/20 p-2 py-4 text-center"
      >
        <h2 class="col-start-2 text-nowrap">Bean-Counter 🫘</h2>
      </header>
      <section
        v-if="currentPage === page.home"
        class="flex w-full flex-wrap place-content-center gap-8 md:place-content-start md:px-12"
      >
        <station-card
          v-for="station in stations"
          :station="station"
          :key="station.id"
        />
      </section>
    </div>
    <footer
      class="sm:p fixed bottom-0 left-0 flex h-[72px] w-screen place-content-around place-items-center border-t border-t-black/20 bg-white px-10 sm:h-screen sm:w-[72px] sm:flex-col sm:border-r sm:border-r-black/20 sm:px-0 sm:py-10 md:place-content-start md:gap-20 md:pt-36"
    >
      <LazyIcon
        :class="[
          currentPage === page.home,
          'rounded-md bg-black fill-white text-white',
        ]"
        class="aspect-square size-8 cursor-pointer p-4"
        name="bean:home"
      ></LazyIcon>
      <LazyIcon
        :class="[
          currentPage === page.home,
          'rounded-md bg-black fill-white text-white',
        ]"
        class="aspect-square size-8 cursor-pointer p-4"
        name="bean:share"
      ></LazyIcon>
      <LazyIcon
        :class="[currentPage === page.home, 'rounded-md bg-black stroke-white']"
        class="aspect-square size-8 cursor-pointer p-4"
        name="bean:settings"
      ></LazyIcon>
    </footer>
  </main>
</template>

<style scoped>
.stroke-white {
  stroke: white;
}
</style>
