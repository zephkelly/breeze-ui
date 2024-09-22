<template>
  <div class="main">
    <BButtonGroup>
        <BButton @click="handleClick" variant="ghost"> Hello</BButton>
        <BButton @click="" holdable variant="solid"> Hello</BButton>
        <BButton @click="handleClick2" holdable variant="solid"> Hello</BButton>
    </BButtonGroup>
  </div>
</template>

<script setup lang="ts">

const { $toggleColorScheme, $resetToSystemScheme } = useNuxtApp();

function handleClick() {
    $toggleColorScheme();
}

function handleClick2() {
    $resetToSystemScheme();
}
</script>

<style scoped>
.main {
    padding: 0.5rem;
}
</style>