<script lang="ts" setup>
import type BeanSession from '../../../models/bean-session';
import StationCard from '~/components/data/station-card.vue';
import Child from '../../../models/child';
import { BeanStation } from '../../../models/bean-station';
import { setCookie } from 'typescript-cookie';
import type BeanSessionDTO from '../../../models/bean-session-dto';

const route = useRoute();
const sessionId = ref<string | undefined>(undefined);
const currentSession = ref<BeanSessionDTO | undefined>(undefined);

// station input
const isEditing = ref<boolean>(false);
const newStationName = ref<string>('');
const tmpStations = ref<BeanStation[]>([]);
const stationRef = ref<HTMLInputElement | null>(null);

const isAddIconVisible = ref<boolean>(true);

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
    sessionId.value = slug[0];
    currentSession.value = await getSessionById(sessionId.value);
    if (!currentSession.value) {
      sessionStorage.clear();
      window.location.href = '/';
    } else {
      setCookie('BeanSession', sessionId.value);
    }
  }
  console.log(currentSession.value);
  currentPage.value =
    parseInt(sessionStorage.getItem('currentPage') || '') || page.home;
  const testStations = ref<BeanStation[]>([
    new BeanStation('#cb472b', 'Massage Station'),
    new BeanStation('#27b21c', 'Coffee Station'),
    new BeanStation('#284aef', 'Snacks'),
    new BeanStation('#9B59B6', 'Casino'),
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
  if (currentSession.value) {
    testStations.value.forEach((station) => {
      currentSession.value?.stations.push(station);
    });
  }
});

function setPage(page: page) {
  currentPage.value = page;
  sessionStorage.setItem('currentPage', page.toString());
}

function addStation() {
  if (newStationName.value.trim() === '') {
    toggleEdit();
    return;
  }
  nextTick(() => stationRef.value?.focus());
  const newStation = new BeanStation('#000000', newStationName.value.trim());
  tmpStations.value.push(newStation);
  newStationName.value = '';
}

async function toggleEdit(value?: boolean) {
  if (value !== undefined) {
    isEditing.value = value;
    newStationName.value = '';
    tmpStations.value = [];
  } else {
    isEditing.value = !isEditing.value;
  }
  if (isEditing.value) {
    nextTick(() => stationRef.value?.focus());
  } else {
    await submitStations();
    tmpStations.value = [];
  }
  newStationName.value = '';
}

async function submitStations() {
  try {
    for (const station of tmpStations.value) {
      let res = await $fetch('/api/session/addStation', {
        method: 'POST',
        body: {
          stationName: station.name,
          hexColor: station.hexColor,
          sessionId: sessionId.value,
        },
      });
      console.log(res);
      currentSession.value?.stations.push(res as unknown as BeanStation);
    }
  } catch (error) {
    console.error('Error submitting stations:', error);
  }
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
        <div
          class="col-start-3 flex h-full min-h-7 w-full place-content-end place-items-center pr-2 md:hidden"
        >
          <button
            class="flex cursor-pointer place-content-center place-items-center text-blue-500"
            @click="toggleEdit()"
          >
            <LazyIcon v-if="!isEditing" class="size-7" name="bean:add-blue" />
            <p v-else class="text-p text-blue-500">submit</p>
          </button>
        </div>
        <h2 class="col-span-3 text-nowrap">Bean-Counter 🫘</h2>
      </header>
      <section
        v-if="currentPage === page.home"
        class="flex w-full place-items-center md:px-8"
      >
        <div
          class="flex w-fit flex-wrap place-content-center gap-8 md:place-content-start"
        >
          <station-card
            v-for="station in currentSession?.stations"
            :key="station.id"
            :station="station"
          />
          <station-card
            v-for="station in tmpStations"
            :key="station.id"
            :station="station"
          />
          <div
            class="relative flex w-60 flex-col rounded-2xl bg-bean-white-400 md:h-60"
            :class="[
              isEditing
                ? 'aspect-square'
                : 'h-[90px] place-content-center place-items-center md:w-[90px]',
            ]"
          >
            <transition
              name="edit"
              @after-enter="isAddIconVisible = true"
              @before-enter="isAddIconVisible = false"
            >
              <div
                v-if="!isEditing"
                @click="toggleEdit()"
                class="absolute bottom-0 left-0 top-0 flex h-full w-full cursor-pointer place-content-center place-items-center p-6"
              >
                <transition name="add-icon">
                  <icon
                    v-if="isAddIconVisible"
                    name="bean:add-blue"
                    class="size-10"
                  />
                </transition>
              </div>
              <div v-else class="absolute bottom-0 left-0 right-0 top-0 p-6">
                <form @submit.prevent="addStation">
                  <div class="flex h-8 place-content-between pb-2">
                    <button type="reset" @click="toggleEdit(false)">
                      <p
                        v-if="isEditing"
                        class="cursor-pointer text-p text-blue-500"
                      >
                        cancel
                      </p>
                    </button>
                    <button type="submit">
                      <p
                        v-if="isEditing"
                        class="cursor-pointer text-p text-blue-500"
                      >
                        submit
                      </p>
                    </button>
                  </div>
                  <label>Name:</label>
                  <input
                    ref="stationRef"
                    name="newStationName"
                    maxlength="100"
                    v-model="newStationName"
                    placeholder="e.g. Casino"
                    class="w-full bg-bean-white-400 p-[2px] px-1 font-sans text-sm text-inherit focus:outline-0 md:text-p"
                  />
                </form>
              </div>
            </transition>
          </div>
        </div>
      </section>
    </div>
    <footer
      class="sm:p fixed bottom-0 left-0 flex h-[72px] w-screen place-content-around place-items-center border-t border-t-gray-400 bg-bean-white-400 px-10 sm:h-screen sm:w-[72px] sm:flex-col sm:border-r sm:border-r-gray-400 sm:px-0 sm:py-10 md:place-content-start md:gap-16 md:pt-16 lg:gap-20 lg:pt-36"
    >
      <div
        :class="[currentPage === page.home ? 'bg-blue-600' : 'bg-black/10']"
        class="flex place-content-center place-items-center rounded-xl p-2"
      >
        <LazyIcon
          :name="
            currentPage === page.home ? 'bean:home-light' : 'bean:home-dark'
          "
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
  </main>
</template>

<style scoped>
.edit-enter-active,
.edit-leave-active {
  transition:
    width 0.15s ease-in-out,
    opacity 0.15s ease-in-out;
}

.edit-enter-from {
  width: 90px;
  opacity: 0;
}

.edit-enter-to {
  width: 240px; /* Adjust to your desired expanded width */
  opacity: 1;
}

.edit-leave-from {
  width: 240px; /* Adjust to your desired expanded width */
  opacity: 1;
}

.edit-leave-to {
  width: 90px;
  opacity: 0;
}

.add-icon-enter-active {
  transition: opacity 0.05s ease-in-out;
}

.add-icon-enter-from {
  opacity: 0;
}

.add-icon-enter-to {
  opacity: 1;
}
</style>
