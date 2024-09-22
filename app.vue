<template>
  <div class="main">
    <BButtonGroup>
        <BButton @click="handleClick" variant="ghost"> Hello</BButton>
        <BButton @click="" holdable variant="solid"> Hello</BButton>
        <BButton @click="handleClick" holdable variant="solid"> Hello</BButton>
    </BButtonGroup>
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