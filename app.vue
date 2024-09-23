<template>
  <div class="main">
    <BButtonGroup>
        <BButton @click="handleClick" variant="ghost"> Hello</BButton>
        <BButton @click="handleClick2" holdable variant="solid"> Hello</BButton>
    </BButtonGroup>
  </div>
</template>

<script setup lang="ts">

const { $toggleColorScheme, $setSystemColorScheme } = useNuxtApp();

function handleClick() {
    $toggleColorScheme();
}

function handleClick2() {
    $setSystemColorScheme();
}
</script>

<style scoped>
.main {
    padding: 0.5rem;
}
</style>