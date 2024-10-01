<template>
    <div class="main">
        <BButton holdable @click="handleClick" variant="ghost" ariaLabel="Toggle page color scheme" size="large">
            Large Button
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="ghost" ariaLabel="Toggle page color scheme" size="medium">
            Medium
        </BButton>
        <BButton holdable @click="handleClick" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Small
        </BButton>
        <BButton holdable @click="handleClick" variant="solid" ariaLabel="Toggle page color scheme" size="tiny">
            Tiny
        </BButton>
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
    display: flex;
    gap: 1rem;
    height: 200px;
}
</style>