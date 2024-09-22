<template>
  <div>
    <BButton @click="handleClick"> Hello</BButton>
  </div>
</template>

<script setup lang="ts">

const { $toggleColorScheme } = useNuxtApp();

function handleClick() {
  console.log('Hello')
  $toggleColorScheme();
}
</script>
