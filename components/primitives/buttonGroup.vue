<template>
    <div 
      role="group" 
      aria-label="Button Group" 
      class="breeze-button-group" 
      :style="{ '--total-buttons': defaultSlotContent.length }"
    >
      <component
        v-for="(child, index) in defaultSlotContent"
        :key="index"
        :is="child"
        :data-index="index"
        :data-total="defaultSlotContent.length"
        :style="{ '--button-index': index }"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useSlots, computed } from 'vue';
  
  const slots = useSlots();
  
  const hasDefaultSlot = computed(() => !!slots.default);
  const defaultSlotContent = computed(() => slots.default?.() || []);
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

.breeze-button-group :deep(.breeze-button:not(.breeze-button--colorway)) {
  margin-right: -1px;
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
  margin-right: 0; /* Remove margin for the last button */
}

.breeze-button-group :deep(.breeze-button:focus-visible) {
  z-index: calc(var(--total-buttons) + 1);
}

.breeze-button-group :deep(.breeze-button--ghost:not(:last-child)) + .breeze-button--ghost {
  border-right-color: inherit;
}
</style>