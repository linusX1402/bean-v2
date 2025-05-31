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
    class="h-6 w-full"
    type="text"
  />
</template>

<style scoped></style>
