<script setup lang="ts"></script>

<template>
  <section
    class="flex w-full place-content-center place-items-center px-2 md:place-content-start md:px-10"
  >
    <div class="h-full w-full rounded-2xl bg-bean-white-400 p-8 md:w-96">
      <login-copy :show-buttons="false" :current-session="useSession().get()" />
    </div>
  </section>
</template>

<style scoped></style>
