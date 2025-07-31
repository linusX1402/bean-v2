<script setup lang="ts">
import { SESSION_CLEANUP_AGE } from '~/constants/constants';

const session = useSession().get();
const expirationDate = new Date(
  new Date(session!.lastInteractionDate).getTime(),
);
const timeDifference =
  new Date().getTime() + SESSION_CLEANUP_AGE - expirationDate.getTime();

import { computed } from 'vue';

const formattedTimeDifference = computed(() => {
  if (timeDifference <= 0) return '00.00';
  const totalMinutes = Math.floor(timeDifference / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}`;
});
</script>

<template>
  <section
    class="flex w-full place-content-center place-items-start px-12 md:place-content-start"
  >
    <div class="setting-section flex w-full flex-col gap-6">
      <ul v-if="session" class="flex flex-col">
        <li>Beans per Tick: {{ session!.beansPerTick }}</li>
        <li>Seconds per Tick: {{ session!.secondsPerTick }}</li>
        <li>Starting Funds: {{ session!.startingFunds }}</li>
      </ul>
      <ul>
        <li>
          Permission:
          {{
            session!.getPermissionOfId(session!.getHighestPermissionSessionId())
          }}
        </li>
      </ul>
      <ul>
        <li>Expiration in: {{ formattedTimeDifference }} Hours</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.setting-section > ul {
  @apply rounded-2xl bg-bean-white-400 p-5 md:w-96;
}
</style>
