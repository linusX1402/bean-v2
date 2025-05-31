<script lang="ts" setup>
const props = defineProps<{
  name: string;
  isRequired: boolean;
  placeholder: string;
}>();
</script>

<template>
  <input
    :name="name"
    :placeholder="placeholder"
    :required="isRequired"
    class="h-6 w-full rounded-md border border-solid border-black/50 p-1"
    type="text"
  />
</template>

<style scoped></style>
