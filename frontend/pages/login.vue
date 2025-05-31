<script setup lang="ts">
const sessionId = 0;
</script>

<template>
  <main>
    <div class="flex w-full place-content-center place-items-center pb-12 pt-8">
      <h1>Bean-Counter 🫘</h1>
    </div>
    <div class="flex flex-col place-content-center place-items-center">
      <form>
        <form-text
          placeholder="Session ID"
          :is-required="true"
          name="sessionId"
        />
      </form>
    </div>
  </main>
</template>

<style scoped></style>
