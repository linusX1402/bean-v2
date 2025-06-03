<script setup lang="ts">
import type BeanSession from '../../../models/session';
import StationCard from '~/components/data/station-card.vue';
import type Child from '~/composables/child';

const route = useRoute();
const sessionId = ref<string | undefined>(undefined);
const currentSession = ref<BeanSession | undefined>(undefined);
const stations = ref<Station[]>([]);

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
    class="flex h-full w-full flex-col place-content-center place-items-center gap-8"
  >
    <header
      class="grid w-full grid-cols-3 place-content-center place-items-center border-b border-b-black/20 text-center"
    >
      <h2 class="col-start-2 text-nowrap">Bean-Counter 🫘</h2>
    </header>
    <section
      class="flex flex-wrap place-content-center gap-8 px-12 sm:place-content-start"
    >
      <station-card
        v-for="station in stations"
        :station="station"
        :key="station.id"
      />
    </section>
  </main>
</template>

<style scoped></style>
