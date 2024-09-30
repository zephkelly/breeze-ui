<template>
    <div class="main">
        <BButton holdable @click="handleClick" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Toggle color scheme
        </BButton>
        <BButton headless v-slot="slotProps" @click="handleClick" variant="ghost" ariaLabel="Toggle page color scheme" size="small" shape=sharp>
            <button v-bind="slotProps" >
                Toggle color scheme
            </button>
        </BButton>
        <BButton @click="handleClick" variant="flat-solid" ariaLabel="Toggle page color scheme" size="small">
            Toggle color scheme
        </BButton>
        <BButton @click="handleClick"  variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Toggle color scheme
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
}
</style>