<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { swipeOption } from '../../composables/swipe-option';

const props = defineProps<{
  option1: swipeOption;
  option2?: swipeOption;
  option3?: swipeOption;
  isUnstable?: boolean;
}>();

const emit = defineEmits(['option-click']);

const swipePosition = ref(0);
const isSwiping = ref(false);
const startX = ref(0);
const outerDivWidth = ref(0); // Tracks the width of the outermost div
const options = [props.option1, props.option2, props.option3].filter(
  Boolean,
) as swipeOption[];
const isMenuOpen = ref(false);
const swipeDirection = ref<'left' | 'right' | null>(null); // Tracks swipe direction

const snapThresholds = computed(() => {
  if (outerDivWidth.value === 0) return 0;
  return (outerDivWidth.value * options.length) / 5; // 20% per option
});

const handleSwipeStart = (event: PointerEvent) => {
  if (props.isUnstable) return;
  isSwiping.value = true;
  startX.value = event.clientX || event.pageX;
  swipeDirection.value = null; // Reset swipe direction
};

const handleSwipeMove = (event: PointerEvent) => {
  if (props.isUnstable || !isSwiping.value) return;
  const currentX = event.clientX || event.pageX;
  const deltaX = startX.value - currentX;

  // Update swipe position dynamically
  swipePosition.value = Math.max(0, deltaX);

  // Determine swipe direction
  swipeDirection.value = deltaX > 0 ? 'left' : 'right';
};

const handleSwipeEnd = () => {
  if (props.isUnstable) return;
  isSwiping.value = false;

  // Always snap open when swiping right to left
  if (swipeDirection.value === 'left') {
    swipePosition.value = snapThresholds.value;
    isMenuOpen.value = true;
  }
  // Always snap closed when swiping left to right
  else if (swipeDirection.value === 'right') {
    closeMenu();
  }
};
const handleInteractionOutside = (event: Event) => {
  const outerDivElement = outerDiv.value;
  if (outerDivElement && !outerDivElement.contains(event.target as Node)) {
    closeMenu();
  }
};

function closeMenu() {
  swipePosition.value = 0;
  isMenuOpen.value = false;
}

const outerDiv = ref<HTMLDivElement | null>(null);
onMounted(() => {
  if (outerDiv.value) {
    outerDivWidth.value = outerDiv.value.clientWidth;
  }
  document.addEventListener('click', handleInteractionOutside);
  document.addEventListener('focusout', handleInteractionOutside);
  document.addEventListener('pointermove', handleInteractionOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleInteractionOutside);
  document.removeEventListener('focusout', handleInteractionOutside);
  document.removeEventListener('pointermove', handleInteractionOutside);
});

function handleButtonClick(index: number) {
  emit('option-click', index);
  console.log(`Option ${index + 1} clicked`);
  closeMenu();
}
</script>

<template>
  <div
    ref="outerDiv"
    class="relative flex h-full w-full place-content-center place-items-center"
    @pointerdown="handleSwipeStart"
    @pointermove="handleSwipeMove"
    @pointerup="handleSwipeEnd"
    @pointercancel="handleSwipeEnd"
  >
    <!-- Swipable content -->
    <div
      class="z-10 flex h-full w-full place-content-center place-items-center transition-transform duration-300 ease-in-out"
      :style="{ transform: `translateX(-${swipePosition}px)` }"
    >
      <slot />
    </div>
    <!-- Options -->
    <div
      class="absolute right-0 top-0 z-0 h-full"
      :style="{ width: `${snapThresholds}px` }"
    >
      <div class="flex h-full w-full place-content-center place-items-center">
        <div
          v-for="(option, i) in options"
          :key="i"
          :class="[option.twColor]"
          class="h-full w-full p-1"
        >
          <button
            class="flex h-full w-full place-content-center place-items-center"
            @click="handleButtonClick(i)"
          >
            <icon :name="option.iconPath" class="size-6" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
