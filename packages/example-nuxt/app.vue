<script setup lang="ts">
import { trpc } from "./trpc";
import { ref } from "vue";

const hello = ref("aaa");

const query = trpc.hello.useQuery({ hello });

watch(query.error, console.error);
</script>

<template>
  <div>
    <input type="text" v-model="hello" />

    <p>Response: {{ query.data.value?.greeting }}</p>
    <p>Error: {{ query.error.value }}</p>
  </div>
</template>
