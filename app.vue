<template>
  <div class="main">
      <BButtonGroup>
        <BButton @click="handleClick" variant="solid" color="green" to="/hello" holdable>
            Handle Click
        </BButton>
        <BButton @click="" variant="ghost" color="green" holdable> Hello</BButton>
        <BButton @click="" variant="ghost" color="green"> Hello</BButton>
        <BButton @click="" variant="ghost" color="green" holdable> Hello</BButton>
        <BButton @click="handleClick" variant="flat" color="green" holdable> Hello</BButton>
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