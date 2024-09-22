<template>
  <div class="main">
    <BButton @click="handleClick"> Hello</BButton>
    <BButton2 @click="handleClick"> Hello</BButton2>
  </div>
</template>

<script setup lang="ts">

const { $toggleColorScheme } = useNuxtApp();

function handleClick() {
  console.log('Hello')
  $toggleColorScheme();
}
</script>

<style scoped>
.main {
    padding: 0.5rem;
}
</style>