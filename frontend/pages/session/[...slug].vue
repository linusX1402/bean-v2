<script setup lang="ts">
import type BeanSession from '../../../models/session';
import StationCard from '~/components/data/station-card.vue';
import Child from '~/composables/child';

const route = useRoute();
const sessionId = ref<string | undefined>(undefined);
const currentSession = ref<BeanSession | undefined>(undefined);
const stations = ref<Station[]>([]);

enum page {
  loading = 0,
  home = 1,
  settings = 2,
  share = 3,
}
const currentPage = ref<page>(page.loading);

onMounted(async () => {
  const slug = route.params.slug as string;
  if (slug) {
    sessionId.value = slug;
    currentSession.value = await getSessionById(sessionId.value);
    if (!currentSession.value) {
      sessionStorage.clear();
      window.location.href = '/';
    }
    console.log(currentSession.value ? 'found session' : 'No session found');
    console.log(currentSession.value);
  }

  currentPage.value =
    parseInt(sessionStorage.getItem('currentPage') || '') || page.home;
});

const testStations = ref<Station[]>([
  new Station(1, '#cb472b', 'Massage Station'),
  new Station(2, '#27b21c', 'Coffee Station'),
  new Station(3, '#284aef', 'Snacks'),
  new Station(5, '#9B59B6', 'Casino'),
]);

const sampleChildren = ref<Child[]>([]);
sampleChildren.value.push(new Child('Tim'));
sampleChildren.value.push(new Child('Maxi'));
sampleChildren.value.push(new Child('Roif'));
sampleChildren.value.push(new Child('July'));
sampleChildren.value.push(new Child('Paula'));

testStations.value.forEach((s) => {
  sampleChildren.value.forEach((c) => {
    s.addChild(c);
  });
});

stations.value = testStations.value;

function setPage(page: page) {
  currentPage.value = page;
  sessionStorage.setItem('currentPage', page.toString());
}
</script>

<template>
  <main
    class="relative flex min-h-screen w-full flex-col place-content-between pb-24"
  >
    <div
      class="flex h-fit w-full flex-col place-content-start place-items-center gap-8 sm:pl-[72px]"
    >
      <header
        class="grid w-full grid-cols-3 place-content-center place-items-center border-b border-b-gray-400 bg-bean-white-400 p-2 py-4 text-center"
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
      class="sm:p fixed bottom-0 left-0 flex h-[72px] w-screen place-content-around place-items-center border-t border-t-gray-400 bg-bean-white-400 px-10 sm:h-screen sm:w-[72px] sm:flex-col sm:border-r sm:border-r-gray-400 sm:px-0 sm:py-10 md:place-content-start md:gap-20 md:pt-36"
    >
      <div
        class="flex place-content-center place-items-center rounded-xl p-2"
        :class="[currentPage === page.home ? 'bg-blue-600' : 'bg-black/10']"
      >
        <LazyIcon
          @click="setPage(page.home)"
          class="aspect-square size-8 cursor-pointer"
          :name="
            currentPage === page.home ? 'bean:home-light' : 'bean:home-dark'
          "
        />
      </div>
      <div
        class="flex place-content-center place-items-center rounded-xl p-2"
        :class="[currentPage === page.share ? 'bg-blue-600' : 'bg-black/10']"
      >
        <LazyIcon
          @click="setPage(page.share)"
          class="aspect-square size-8 cursor-pointer"
          :name="
            currentPage === page.share ? 'bean:share-light' : 'bean:share-dark'
          "
        />
      </div>
      <div
        class="flex place-content-center place-items-center rounded-xl p-2"
        :class="[currentPage === page.settings ? 'bg-blue-600' : 'bg-black/10']"
      >
        <LazyIcon
          @click="setPage(page.settings)"
          class="aspect-square size-8 cursor-pointer"
          :name="
            currentPage === page.settings
              ? 'bean:settings-light'
              : 'bean:settings-dark'
          "
        />
      </div>
    </footer>
  </main>
</template>

<style scoped></style>
