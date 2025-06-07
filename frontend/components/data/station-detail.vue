<script setup lang="ts">
import ChildRow from '~/components/data/child-row.vue';
import Child from '../../../models/child';
import type { BeanStation } from '../../../models/bean-station';
import { removeCookie, getCookie, setCookie } from 'typescript-cookie';

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

onMounted(() => {
  sessionId.value = getCookie('BeanSession') || undefined;
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
  for (const child of tempChildren.value) {
    console.log('Submitting child:', child.name);
    console.log(sessionId.value);
    console.log('Station ID:', props.station.id);
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
    <main>
      <div class="w-full px-8">
        <ul class="w-full rounded-2xl bg-bean-white-400 px-2 py-1">
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
                  class="w-full bg-bean-white-400 p-[2px] px-1 font-sans text-sm text-inherit focus:outline-0 md:text-p"
                />
              </form>
            </li>
          </transition>
        </ul>
      </div>
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
</style>
