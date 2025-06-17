<script setup lang="ts">
import ChildRow from '~/components/data/child-row.vue';
import Child from '../../../models/child';
import type { BeanStation } from '../../../models/bean-station';
import cookieService from '~/composables/cookie-service';

const props = defineProps<{ station: BeanStation }>();
const emit = defineEmits<{
  (e: 'closeDetail'): void;
}>();
const isEditing = ref<boolean>(false);
const childInput = ref<string>('');
const childRef = ref<HTMLInputElement | null>(null);
const newChildNameError = ref<boolean>(false);
const tempChildren = ref<Child[]>([]);
const sessionId = ref<string | undefined>(undefined);
const currentOpenMenu = ref<headerMenus>('start');

type headerMenus = 'reset' | 'start' | 'stop';

onMounted(() => {
  sessionId.value = cookieService().getCurrentSession();
});

async function toggleEdit() {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    nextTick(() => childRef.value?.focus());
  } else {
    await submitChildren();
    tempChildren.value = [];
  }
}

function addChild() {
  if (childInput.value.trim() === '') {
    toggleEdit();
    return;
  }
  const newChild = new Child(childInput.value.trim());
  tempChildren.value.push(newChild);
  childInput.value = '';
}

async function submitChildren() {
  while (tempChildren.value.length > 0) {
    const child = tempChildren.value.shift();
    if (child) {
      let res = await $fetch('/api/session/addChild', {
        method: 'POST',
        body: {
          name: child.name,
          stationId: props.station.id,
          sessionId: sessionId.value,
        },
      });
      props.station.children.push((res as unknown as Child) || undefined);
    }
  }
}

function startAll() {
  if (currentOpenMenu.value === 'start') {
  }
}

function stopAll() {
  if (currentOpenMenu.value === 'stop') {
  }
}

function restAll() {
  if (currentOpenMenu.value === 'reset') {
  }
}

function setHederMenu(to: headerMenus) {
  currentOpenMenu.value = to;
}
</script>

<template>
  <section class="flex h-full w-full flex-col gap-12 bg-bean-white-500 pb-6">
    <header
      class="text-blue grid grid-cols-3 place-content-center place-items-center gap-y-2 border-b border-b-black/20 bg-white/60 p-2 py-4 pt-4 text-center"
    >
      <div
        class="flex h-full min-h-7 w-full place-content-start place-items-center pl-2"
      >
        <button
          @click="$emit('closeDetail')"
          class="flex cursor-pointer place-content-center place-items-center text-blue-500"
        >
          <LazyIcon name="bean:chevron-left-blue" class="size-7" />
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
          <LazyIcon v-if="!isEditing" name="bean:add-blue" class="size-7" />
          <p v-else class="text-p text-blue-500">submit</p>
        </button>
      </div>
      <h3 class="col-span-3 w-full pl-4 text-start">{{ station.name }}</h3>
    </header>
    <main
      class="flex w-full flex-col place-content-start place-items-center gap-8 px-8"
    >
      <transition-group
        tag="ul"
        name="icon-menu"
        type="transition"
        key="icon-menu"
        :duration="300"
        class="flex place-content-center place-items-center gap-2"
      >
        <li
          key="menu-start"
          @click="setHederMenu('start')"
          :class="[
            currentOpenMenu === 'start' ? 'px-3' : 'aspect-square min-w-8',
          ]"
          class="flex h-10 cursor-pointer select-none place-content-center place-items-center rounded-xl bg-green-500 p-1 transition-all duration-300 ease-in-out"
        >
          <icon
            v-if="currentOpenMenu !== 'start'"
            name="bean:play"
            class="size-8"
          />
          <h6 class="text-white" v-else>Start</h6>
        </li>
        <li
          key="menu-stop"
          @click="setHederMenu('stop')"
          :class="[
            currentOpenMenu === 'stop' ? 'px-3' : 'aspect-square min-w-8',
          ]"
          class="flex h-10 cursor-pointer select-none place-content-center place-items-center rounded-xl bg-red-500 p-1 text-red-50 transition-all duration-300 ease-in-out"
        >
          <icon
            v-if="currentOpenMenu !== 'stop'"
            name="bean:stop"
            class="size-8"
          />
          <h6 class="text-white" v-else>Stop</h6>
        </li>
        <li
          key="menu-reset"
          @click="setHederMenu('reset')"
          :class="[
            currentOpenMenu === 'reset' ? 'px-3' : 'aspect-square min-w-8',
          ]"
          class="flex h-10 cursor-pointer select-none place-content-center place-items-center rounded-xl bg-orange-400 p-1 transition-all duration-300 ease-in-out"
        >
          <icon
            v-if="currentOpenMenu !== 'reset'"
            name="bean:reset"
            class="size-8"
          />
          <h6 class="text-white" v-else>Reset</h6>
        </li>
      </transition-group>

      <ul class="w-full rounded-2xl bg-bean-white-400 px-2 pt-1 md:py-1">
        <li
          class="flex w-fit place-content-center place-items-center gap-2 px-2 py-2 font-semibold text-gray-400"
        >
          <p>Children</p>
        </li>
        <child-row v-for="child in station.children" :child="child" />
        <child-row
          v-for="child in tempChildren"
          :child="child"
          :is-unstable="true"
        />
        <transition name="edit">
          <li
            v-if="isEditing"
            class="h-10 border-t border-t-gray-300 px-1 py-2"
          >
            <form @submit.prevent="addChild">
              <input
                :class="{
                  'rounded-md outline outline-red-500': newChildNameError,
                }"
                ref="childRef"
                v-model="childInput"
                type="text"
                placeholder="Add new child"
                class="w-full bg-bean-white-400 p-[2px] px-1 font-sans text-p text-inherit focus:outline-0 md:text-p lg:text-lg-p"
              />
            </form>
          </li>
        </transition>
      </ul>
    </main>
  </section>
</template>

<style scoped>
.edit-enter-active,
.edit-leave-active {
  transition: transform 0.1s ease;
}

.edit-enter-from {
  transform: translateY(20%);
}

.edit-enter-to {
  transform: translateY(0);
}

.edit-leave-from {
  transform: translateY(0);
}
.edit-leave-to {
  transform: translateY(20%);
}

.menu-start-enter-active,
.menu-start-leave-active {
  transition: transform 0.3s ease;
}

.menu-start-enter-from {
  opacity: 0;
}

.menu-start-enter-to {
  opacity: 1;
}

.menu-start-leave-from {
  opacity: 1;
}
.menu-start-leave-to {
  opacity: 0;
}
</style>
