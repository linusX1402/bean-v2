<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string;
    isRequired: boolean;
    placeholder?: string;
    maxLength?: number;
  }>(),
  { maxLength: 9999 },
);
const returnVal = ref<string>('');
</script>

<template>
  <input
    v-model="returnVal"
    :name="name"
    :placeholder="placeholder"
    :required="isRequired"
    class="h-6 w-full rounded-md border border-solid border-black/50 p-1"
    type="text"
    :maxlength="maxLength"
  />
</template>
