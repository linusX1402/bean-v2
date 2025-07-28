<script setup lang="ts">
import { getDynamicBaseURL } from '~/composables/dynamic-base-url';
import type BeanSession from '~/models/bean-session';

const props = defineProps<{ currentSession: BeanSession | undefined }>();

let baseUrl = getDynamicBaseURL();

const selectedPermission = ref<string>('Admin');
const permissions = ref<string[]>(['Admin', 'Edit', 'View']);
const emits = defineEmits(['update:back']);
const copied = ref<boolean>(false);

function emitChangeView() {
  emits('update:back');
}

function copyToClipboard() {
  const link = getCurrentLink();
  navigator.clipboard
    .writeText(link)
    .then(() => {
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    })
    .catch((err) => {
      console.error('Failed to copy link:', err);
    });
}

function getCurrentLink(permission?: string) {
  const perm = permission ? permission : selectedPermission.value;
  let sessionIdByPerm: string | undefined = '';
  if (perm === 'Admin') {
    sessionIdByPerm = props.currentSession?.sessionIdAdmin;
  } else if (perm === 'Edit') {
    sessionIdByPerm = props.currentSession?.sessionIdEditor;
  } else if (perm === 'View') {
    sessionIdByPerm = props.currentSession?.sessionIdUser;
  }

  return baseUrl + '/session/' + sessionIdByPerm;
}

function forwardUser(uuid: string) {
  const redirectPath = `${baseUrl}/session/${uuid}/home`;
  window.location.href = redirectPath;
}
</script>

<template>
  <section
    class="flex h-full flex-col place-content-between place-items-center gap-8"
  >
    <h4>Copy to share</h4>
    <div>
      <label>permissions:</label>
      <div>
        <select
          v-model="selectedPermission"
          class="h-fit w-full rounded-md border border-solid border-gray-400 p-1"
        >
          <option v-for="i in permissions" :value="i">{{ i }}</option>
        </select>
      </div>
    </div>
    <div class="flex w-full gap-8">
      <p class="w-full select-none overflow-x-auto text-nowrap">
        {{ getCurrentLink() }}
      </p>
      <button type="button">
        <LazyIcon
          :name="copied ? 'bean:check' : 'bean:copy'"
          @click="copyToClipboard"
          class="size-6"
        />
      </button>
    </div>
    <div
      class="grid w-full grid-cols-2 place-content-center place-items-center gap-4"
    >
      <ui-button @click="emitChangeView" :style="'secondary'" :type="'button'"
        >back
      </ui-button>
      <a
        class="w-full"
        @click="forwardUser(currentSession?.sessionIdAdmin || '')"
      >
        <ui-button :style="'primary'" :type="'button'">continue </ui-button>
      </a>
    </div>
  </section>
</template>
