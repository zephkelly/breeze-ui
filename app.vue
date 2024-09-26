<template>
    <div class="main">
        <BButton @click="handleClick" variant="solid" color="green" size="tiny" holdable bounce>
            <template #leading>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>
            </template>
            Click me!
        </BButton>
        <BToggleButton onLabel="Click me!" v-model="isActive" offLabel="Don't click me!" size="tiny" holdable bounce>
            <template #leading>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>
            </template>
        </BToggleButton>
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
const isActive = ref(false);

function handleUpdate(value: boolean) {
    isActive.value = value;
}


watch(() => isActive.value, (value) => {
    console.log('isActive:', value);
});

</script>

<style scoped>
.main {
    padding: 0.5rem;
}
</style>