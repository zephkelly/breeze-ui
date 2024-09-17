<template>
    <button
        :class="[
            { 'breeze-toggle-button': !unstyled },
            { [`breeze-toggle-button--${validatedVariant}`]: !unstyled },
            { 'breeze-toggle-button--loading': loading },
            { 'breeze-toggle-button--rounded': round },
            { 'breeze-toggle-button--checked': modelValue },
        ]"
        :disabled="disabled || loading"
        :aria-disabled="disabled || loading"
        :aria-busy="loading"
        :aria-label="ariaLabel"
        :aria-pressed="modelValue"
        @click="toggle"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { type ToggleButtonProps, ToggleButtonVariants } from './../../types/toggleButton';

const props = defineProps<ToggleButtonProps>();
const emit = defineEmits(['update:modelValue']);

const toggle = () => {
    if (!props.disabled && !props.loading) {
        emit('update:modelValue', !props.modelValue);
    }
};

const validatedVariant = computed(() => {
    if (props.variant !== undefined && Object.values(ToggleButtonVariants).includes(props.variant)) {
        return props.variant;
    }

    if (import.meta.dev) {   
        if (props.variant as string === '') {
            console.warn(`breeze-ui: Empty button variant. Defaulting to '${ToggleButtonVariants[0]}'`);
            console.warn(`breeze-ui: Valid button variants are: ${Object.values(ToggleButtonVariants).join(', ')}`);
        }
        else if (props.variant !== undefined) {
            console.warn(`breeze-ui: Invalid button variant: '${props.variant}'. Defaulting to '${ToggleButtonVariants[0]}'`);
            console.warn(`breeze-ui: Valid button variants are: ${Object.values(ToggleButtonVariants).join(', ')}`);
        }
    }

    return ToggleButtonVariants[0];
});
</script>

<style scoped>

</style>