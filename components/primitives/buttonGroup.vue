<template>
    <div
        role="group"
        aria-label="Button Group"
        class="breeze-button-group"
        :style="{ '--total-buttons': processedButtons.length }"
    >
        <component
            v-for="(button, index) in processedButtons"
            :key="index"
            :is="button.component"
            v-bind="button.props"
            :data-index="index"
            :data-total="processedButtons.length"
            :data-same-colorway="button.sameColorway"
            :style="{ '--button-index': index }"
        />
    </div>
</template>
  
<script setup lang="ts">
import { useSlots, computed } from 'vue';

const slots = useSlots();

const defaultSlotContent = computed(() => slots.default?.() || []);

const processedButtons = computed(() => {
    return defaultSlotContent.value.map((button, index, array) => {
    const colorwayClass = button.props?.class?.match(/breeze-button--colorway-\w+/)?.[0];
    const nextButton = array[index + 1];
    const nextColorwayClass = nextButton?.props?.class?.match(/breeze-button--colorway-\w+/)?.[0];
    
    return {
        component: button,
        props: button.props || {},
        sameColorway: colorwayClass && colorwayClass === nextColorwayClass
    };
    });
});
</script>
  

<style scoped>
.breeze-button-group {
    display: inline-flex;
    padding: 0;
    margin: 0;
    --total-buttons: 1;
}
.breeze-button-group :deep(.breeze-button) {
    position: relative;
    z-index: calc(var(--total-buttons) - var(--button-index, 0));
}
.breeze-button-group :deep(.breeze-button.breeze-button--ghost) {
    margin-right: -1px;
}
.breeze-button-group :deep(.breeze-button[class="breeze-button--colorway"]) {
    margin-right: 0;
}
.breeze-button-group :deep(.breeze-button:not(:first-child):not(:last-child)) {
    border-radius: 0;
}
.breeze-button-group :deep(.breeze-button:first-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.breeze-button-group :deep(.breeze-button:last-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.breeze-button-group :deep(.breeze-button:focus-visible) {
    z-index: calc(var(--total-buttons) + 1);
}
</style>