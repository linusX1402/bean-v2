<script setup lang="ts">
import ChildRow from '~/components/station/child-row.vue';
import Child from '~/models/child';
import type { BeanStation } from '~/models/bean-station';
import cookieService from '~/composables/cookie-service';
import StationDetailHeader from '~/components/station/station-detail-header.vue';

const props = defineProps<{ station: BeanStation }>();
const emit = defineEmits<{
  (e: 'update:close-detail'): void;
}>();
const isEditing = ref<boolean>(false);
const childInput = ref<string>('');
const childRef = ref<HTMLInputElement | null>(null);
const newChildNameError = ref<boolean>(false);
const tempChildren = ref<Child[]>([]);
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
