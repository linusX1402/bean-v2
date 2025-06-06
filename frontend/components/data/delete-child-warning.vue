<script setup lang="ts">
const props = defineProps<{ showDialog: boolean }>();
const emit = defineEmits(['delete', 'cancel']);
const dialog = ref<HTMLDialogElement | undefined>(undefined);

type emits = 'delete' | 'cancel';

function showDialog() {
  dialog.value?.showModal;
  document.body.style.overflow = 'hidden';
}
function hideDialog() {
  dialog.value?.close();
  document.body.style.overflow = 'auto';
}
</script>

<template>
  <button @click="showDialog" class="text-blue-500">
    <LazyIcon name="bean:trash"></LazyIcon>
  </button>
  <dialog ref="dialog">
    <form
      class="flex h-32 w-40 flex-col place-items-center rounded-2xl bg-bean-white-400"
      @submit.prevent=""
      @reset="hideDialog"
    >
      <h1>Delete All Children</h1>
      <p>Are you sure you want to delete all children?</p>
      <div class="border-t border-t-gray-400">
        <button type="reset" class="text-blue-500">Cancel</button>
        <button type="submit" class="text-red-500">Delete</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped></style>
