<script lang="ts" setup>
import StationCard from '~/components/data/station-card.vue';
import { BeanStation } from '../../../models/bean-station';
import { getCookie, setCookie } from 'typescript-cookie';
import type BeanSessionDTO from '../../../models/bean-session-dto';
import { cookieService } from '#imports';
import HomeFooter from '~/components/ui/home-footer.vue';
import HomeHeader from '~/components/ui/home-header.vue';

const route = useRoute();
const router = useRouter();
const sessionId = ref<string | undefined>(undefined);
const currentSession = ref<BeanSessionDTO | undefined>(undefined);

// station input
const isEditing = ref<boolean>(false);
const newStationName = ref<string>('');
const hexColor = ref<string>('#0A60FF');
const tmpStations = ref<BeanStation[]>([]);
const stationRef = ref<HTMLInputElement | null>(null);

// animations
const isAddIconVisible = ref<boolean>(true);
const addStationRef = ref<HTMLDivElement | null>(null);

enum page {
  loading = 0,
  home = 1,
  share = 2,
  settings = 3,
}

const pageToSlugMap: Record<page, string> = {
  [page.loading]: 'loading',
  [page.home]: 'home',
  [page.share]: 'share',
  [page.settings]: 'settings',
};

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
      cookieService().addSession(sessionId.value);
      setCookie('bean_icon', currentSession.value.icon);
    }
    currentPage.value = sessionStorage.getItem('currentPage')
      ? (parseInt(sessionStorage.getItem('currentPage') || '') as page)
      : page.home;
  }
  setPageOnLoad();
});

function setPageOnLoad() {
  const slug = route.params.slug as string;
  if (slug.length < 2) {
    setPage(toPage(slug[1]) || page.home);
  }
}

function toPage(slug: string): page | undefined {
  const entry = Object.entries(pageToSlugMap).find(
    ([, value]) => value === slug,
  );
  return entry ? (parseInt(entry[0]) as page) : undefined;
}

function setPage(page: page) {
  currentPage.value = page;
  sessionStorage.setItem('currentPage', page.toString());
  const slug = pageToSlugMap[page];
  if (slug) {
    router.push(`/session/${sessionId.value}/${slug}`);
  }
}

// ROUTEING;
// function setActiveDetail(name: string) {
//   const slug = route.params.slug;
//   if (slug.length < 3) {
//     router.push(`${slug[1]}/${name?.toLowerCase()}`);
//   } else {
//     router.push(`${name?.toLowerCase()}`);
//   }
// }

// function clearActiveDetail() {
//   console.log('clear detail');
//   const slug = route.params.slug;
//   if (slug.length >= 3) {
//     router.push(`/session/${slug[0]}/${slug[1]}`);
//   }
// }

function clearDetail() {
  const slug = route.params.slug;
  if (slug.length >= 3) {
    router.push('');
  }
}

function addStation() {
  if (newStationName.value.trim() === '') {
    toggleEdit();
    return;
  }
  nextTick(() => stationRef.value?.focus());
  const newStation = new BeanStation(
    hexColor.value,
    newStationName.value.trim(),
  );
  tmpStations.value.push(newStation);
  newStationName.value = '';
  scrollToAddStationCard();
}

async function toggleEdit(value?: boolean) {
  if (value) {
    isEditing.value = value;
    newStationName.value = '';
    tmpStations.value = [];
  } else {
    isEditing.value = !isEditing.value;
  }
  if (isEditing.value) {
    nextTick(() => {
      stationRef.value?.focus();
      scrollToAddStationCard(250);
    });
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
      currentSession.value?.stations.push(res as unknown as BeanStation);
    }
  } catch (error) {
    console.error('Error submitting stations:', error);
  }
}

function scrollToAddStationCard(delay: number = 0) {
  setTimeout(() => {
    if (addStationRef.value) {
      addStationRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, delay);
}

function logout() {
  sessionStorage.clear();
  sessionStorage.setItem('forward', 'false');
  window.location.href = '/';
}
</script>

<template>
  <main
    class="relative flex min-h-screen w-full flex-col place-content-between overflow-x-hidden pb-24"
  >
    <div
      class="flex h-fit w-full flex-col place-content-start gap-8 sm:pl-[72px] md:place-items-center"
    >
      <!-- Header -->
      <home-header
        :is-editing="isEditing"
        @update:logout="logout"
        @update:add-station="addStation"
        @update:toggle-edit="toggleEdit"
      />

      <section
        v-if="currentPage === page.home"
        class="flex w-full place-content-center place-items-center md:place-content-start md:px-8"
      >
        <div
          class="flex w-fit flex-wrap place-content-center gap-8 md:place-content-start"
        >
          <station-card
            v-for="station in [
              ...(currentSession?.stations || []),
              ...tmpStations,
            ]"
            :key="station.id"
            :station="station"
            :is-unstable="tmpStations.includes(station)"
          />
          <!-- ROUTEING -->
          <!--            @update:open-detail="setActiveDetail"-->
          <!--            @update:close-detail="clearActiveDetail"-->
          <div
            class="relative flex w-60 flex-col rounded-2xl bg-bean-white-400 transition-all duration-[250ms] ease-in-out md:h-60"
            :class="[
              isEditing
                ? 'h-60 w-60'
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
                  <div class="flex flex-col gap-2">
                    <div class="flex flex-col">
                      <label>Name:</label>
                      <input
                        ref="stationRef"
                        name="newStationName"
                        maxlength="100"
                        v-model="newStationName"
                        placeholder="e.g. Casino"
                        class="w-full bg-bean-white-400 p-[2px] px-1 font-sans text-sm text-inherit focus:outline-0 md:text-p"
                      />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-nowrap"> Station Color: </label>
                      <div class="relative h-10 w-10">
                        <input
                          class="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                          type="color"
                          name="stationHexColor"
                          v-model="hexColor"
                        />
                        <div
                          class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-md"
                        >
                          <div
                            class="absolute z-10 h-4/5 w-4/5 rounded-full border-2 border-bean-white-400"
                            :style="{ backgroundColor: hexColor }"
                          ></div>

                          <div
                            class="color-circle absolute inset-0 rounded-full border-4 border-solid border-transparent"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </transition>
            <div ref="addStationRef"></div>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <home-footer
      :current-page="currentPage"
      @update:logout="logout"
      @update:set-page="setPage"
    />
  </main>
</template>

<style scoped>
.edit-enter-active,
.edit-leave-active {
  transition:
    width 0.25s ease-in-out,
    opacity 0.25s ease-in-out;
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

.color-circle {
  background: conic-gradient(
      from 0deg,
      #ff0000,
      #ffa500,
      #ffff00,
      #008000,
      #0000ff,
      #4b0082,
      #ee82ee,
      #ff0000
    )
    border-box;
  /* stylelint-disable */
  -webkit-mask: linear-gradient(#ffffff 0 0) padding-box
    linear-gradient(#ffffff 0 0);
  /* stylelint-enable */
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
</style>
