<template>
  <div class="main">
    <BButton @click="handleClick"> Hello</BButton>
    <BButton @click="handleClick" holdable variant="ghost" color="orange" bounce> Hello</BButton>
    <BButton @click="handleClick" holdable variant="ghost" color="green" bounce> Hello</BButton>
  </div>
</template>

<script setup lang="ts">

const { $toggleColorScheme } = useNuxtApp();

function handleClick() {
  $toggleColorScheme();
}
</script>

<style scoped>
.main {
    padding: 0.5rem;
}
</style>