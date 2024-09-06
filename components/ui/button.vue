<template>
    <button
        :class="[
                { 'breeze-button': !unstyled },
                { [`breeze-button--${variant}`]: !unstyled },
                { 'breeze-button--loading': loading },
            ]"
            v-bind="$attrs"
            @click="$emit('click', $event)"
        >
        <slot v-if="!loading">
            <span v-if="$slots['icon-left']" class="icon">
                <slot name="icon-left"></slot>
            </span>
            <slot name="default"></slot>
            <slot name="icon-right"></slot>
        </slot>
        <span v-else class="breeze-button__loader">
            <slot name="loader">Loading...</slot>
        </span>
    </button>
</template>
  
<script setup lang="ts">
    const props = defineProps({
        variant: {
            type: String,
            default: 'primary',
            validator: (value: string) => ['primary', 'secondary', 'text'].includes(value)
        },
        loading: Boolean,
        unstyled: Boolean
    })
  
    defineEmits(['click'])
</script>
    
<style scoped>
    .breeze-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .icon > svg {
        fill: black;
    }
</style>