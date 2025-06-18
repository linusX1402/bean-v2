<template>
  <div>
    <h1>Nuxt 3 WebSocket Client</h1>
    <form @submit.prevent="sendMessage">
      <input v-model="message" type="text" />
      <button type="submit">Send Message</button>
    </form>
    <h2>Messages:</h2>
    <ul>
      <li v-for="(msg, index) in receivedMessages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getDynamicBaseURL } from '#imports';

const message = ref('');
const receivedMessages = ref<string[]>([]);
let ws: WebSocket | null = null;

onMounted(() => {
  // Determine WebSocket protocol based on window protocol
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = getDynamicBaseURL(protocol);

  // Create WebSocket connection
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
    receivedMessages.value.push(event.data);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
});

onUnmounted(() => {
  // Clean up WebSocket connection
  if (ws) {
    ws.close();
  }
});

const sendMessage = () => {
  if (ws && ws.readyState === WebSocket.OPEN && message.value) {
    ws.send(message.value);
    message.value = '';
  }
};
</script>
