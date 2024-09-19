<template>
    <div id="app">
        <BreezeButton @click="handleClick">
            <template v-slot:default>
                <span>Click me</span>
            </template>
        </BreezeButton>
    </div>
</template>

<script lang="ts" setup>

const { $toggleColorScheme } = useNuxtApp();

function handleClick() {
    //@ts-ignore
    $toggleColorScheme();
}
</script>