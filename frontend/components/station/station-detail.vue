<script setup lang="ts">
import ChildRow from '~/components/station/child-row.vue';
import Child from '~/models/child';
import type { BeanStation } from '~/models/bean-station';
import cookieService from '~/composables/cookie-service';
import StationDetailHeader from '~/components/station/station-detail-header.vue';
import type { workingState } from '~/constants/constants';

const props = defineProps<{ station: BeanStation }>();
const emit = defineEmits<{
  (e: 'update:close-detail'): void;
}>();
const isEditing = ref<boolean>(false);
const childInput = ref<string>('');
const childRef = ref<HTMLInputElement | null>(null);
const newChildNameError = ref<boolean>(false);
const tmpChildren = ref<Map<number, Child>>(new Map());
let runningId = -1;
const sessionId = ref<string | undefined>(undefined);

onMounted(() => {
  sessionId.value = cookieService().getCurrentSession();
});

async function toggleEdit() {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    nextTick(() => childRef.value?.focus());
  } else {
    await submitChildren();
    tmpChildren.value = new Map();
  }
}

function addChild() {
  if (childInput.value.trim() === '') {
    toggleEdit();
    return;
  }
  const newChild = new Child(childInput.value.trim());
  tmpChildren.value.set(newChild.id, newChild);
  childInput.value = '';
}

async function submitChildren() {
  for (const child of tmpChildren.value.values()) {
    await useSession().addChild(props.station.id, child);
  }
}

function updateChildWorkState(child: Child, workState: workingState) {
  console.log('Updating child work state:', child.name, child.id, workState);
  useWebSocket().updateChild(child.id, props.station.id, workState);
}
</script>

<template>
  <section class="flex h-full w-full flex-col gap-12 bg-bean-white-500 pb-6">
    <station-detail-header
      :station-name="station.name"
      :is-editing="isEditing"
      @update:close-detail="$emit('update:close-detail')"
      @update:toggle-edit="toggleEdit"
    />
    <main
      class="flex w-full flex-col place-content-start place-items-center gap-8 px-8"
    >
      <ul class="w-full rounded-2xl bg-bean-white-400 px-2 pt-1 md:py-1">
        <li
          class="flex w-fit place-content-center place-items-center gap-2 px-2 py-2 font-semibold text-gray-400"
        >
          <p>Children</p>
        </li>
        <child-row
          v-for="child of [
            ...station.children.values(),
            ...tmpChildren.values(),
          ]"
          :station-id="station.id"
          :child="child"
          :is-unstable="tmpChildren.has(child.id)"
          :key="child.id"
          @update:work-state="updateChildWorkState(child, $event)"
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
                class="w-full bg-bean-white-400 p-[2px] px-1 text-sm text-inherit focus:outline-0 md:text-p"
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
