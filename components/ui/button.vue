<template>
    <button
        :class="[
                { 'breeze-button': !unstyled },
                { [`breeze-button--${variant}`]: !unstyled },
                { 'breeze-button--loading': loading },
            ]"
            v-bind="$attrs"
            :disabled="disabled || loading"
            :aria-disabled="disabled || loading"
            :aria-busy="loading"
            :aria-label="ariaLabel"
            @click="handleClick"
        >
        <div class="button-content" v-if="!loading">
            <span v-if="$slots['icon-left']" class="icon left" aria-hidden="true"> 
                <slot name="icon-left"></slot>
            </span>
            <span class="content-main">
                <slot></slot>
            </span>
            <span v-if="$slots['icon-right']" class="icon right" aria-hidden="true">
                <slot name="icon-right"></slot>
            </span>
        </div>
        <span v-else class="button-loader" aria-hidden="true">
            <slot name="loader">Loading...</slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { type ButtonProps } from './../../types/button';

const props = defineProps<ButtonProps>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>();

const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
        emit('click', event);
    }
};

const ariaLabel = computed(() => {
    if (props.ariaLabel) {
        return props.ariaLabel;
    }
    
    return props.loading ? 'Loading' : undefined;
});
</script>

<!-- Default Styled -->
<style scoped>
.breeze-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius-6);
    font-weight: 500;
    color: var(--color-accent);
    cursor: pointer;
}

.button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon {
    display: inline-flex;
    align-items: center;
}
.icon.left {
    margin-right: 0.5rem;
}
.icon.right {
    margin-left: 0.5rem;
}
</style>

<!-- Variants -->
<style scoped>

</style>