<script setup lang="ts">
import { ref } from "vue";

const text = ref("aaa");

const query = trpc.hello.useQuery({ text });
</script>

<template>
  <div>
    <input type="text" v-model="text" />

    <p>Response: {{ query.data.value?.greeting }}</p>
    <p>Now: {{ query.data.value?.now }}</p>
    <p>Error: {{ query.error.value }}</p>
  </div>
</template>
