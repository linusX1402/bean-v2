<script lang="ts" setup>
const emit = defineEmits(['update:add', 'update:subtract']);

const addAnimation = ref(false);
const subtractAnimation = ref(false);
const animationDuration = 300;

function add() {
  emit('update:add');
  addAnimation.value = true;
  setTimeout(() => {
    addAnimation.value = false;
  }, animationDuration);
}
function subtract() {
  emit('update:subtract');
  subtractAnimation.value = true;
  setTimeout(() => {
    subtractAnimation.value = false;
  }, animationDuration);
}
</script>

<template>
  <div class="flex place-content-center place-items-center">
    <button
      :class="subtractAnimation ? 'bg-bean-gray-400' : 'bg-bean-gray-300'"
      class="bg-bean flex place-content-center place-items-center rounded-l-md px-2 py-1"
      type="button"
      @click="subtract"
    >
      <icon name="bean:minus"></icon>
    </button>
    <button
      :class="addAnimation ? 'bg-bean-gray-400' : 'bg-bean-gray-300'"
      class="bg-bean flex place-content-center place-items-center rounded-r-md px-2 py-1 transition-colors duration-150"
      type="button"
      @click="add"
    >
      <icon name="bean:plus"></icon>
    </button>
  </div>
</template>

<style scoped></style>
