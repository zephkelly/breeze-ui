<template>
    <div class="main">
        <BButton holdable @click="handleClick" color="red" variant="solid" ariaLabel="Toggle page color scheme" size="large">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="solid" ariaLabel="Toggle page color scheme" size="medium">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="solid" ariaLabel="Toggle page color scheme" size="tiny">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="blue" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="green" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="blue" variant="ghost" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="blue" variant="flat" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="ghost" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
        <BButton holdable @click="handleClick" color="red" variant="flat" ariaLabel="Toggle page color scheme" size="small">
            Large
        </BButton>
    </div>
    <div class="box">
        <BButton holdable invert @click="handleClick2" color="red" variant="solid" ariaLabel="Toggle page color scheme" size="small">
            System
        </BButton>
    </div>
</template>

<script setup lang="ts">


const { $toggleColorScheme, $setSystemColorScheme } = useNuxtApp();

function handleClick() {
    // $toggleColorScheme();
}

function handleClick2() {
    $setSystemColorScheme();
}
</script>

<style scoped>
.main {
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
}

.box {
    height: 400px;
    background-color: var(--foreground);
    PADDING: 2rem;
}
</style>