<template>
    <component
        v-if="!to"
        :is="tag"
        :class="[
                { 'breeze-button': !unstyled },
                { [`breeze-button--${validatedVariant}`]: !unstyled },
                { 'breeze-button--loading': loading },
            ]"
            v-bind="$attrs"
            :disabled="disabled || loading"
            :aria-disabled="disabled || loading"
            :aria-busy="loading"
            :aria-label="ariaLabel"
            :href="href"
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
    </component>
    <NuxtLink
        v-else
        :to="to"
        :class="[
                { 'breeze-button': !unstyled },
                { [`breeze-button--${validatedVariant}`]: !unstyled },
                { 'breeze-button--loading': loading },
            ]"
            v-bind="$attrs"
            :disabled="disabled || loading"
            :aria-disabled="disabled || loading"
            :aria-busy="loading"
            :aria-label="ariaLabel"
            :href="href"
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
    </NuxtLink>
</template>

<script setup lang="ts">
import { type ButtonProps, ButtonVariants } from './../../types/button';

const props = defineProps<ButtonProps>();

const tag = computed(() => {
    if (props.href) return 'a';
    return 'button';
});

const validatedVariant = computed(() => {
    if (props.variant !== undefined && Object.values(ButtonVariants).includes(props.variant)) {
        return props.variant;
    }

    if (import.meta.dev) {   
        if (props.variant as string === '') {
            console.warn(`breeze-ui: Empty button variant. Defaulting to '${ButtonVariants[0]}'`);
            console.warn(`breeze-ui: Valid button variants are: ${Object.values(ButtonVariants).join(', ')}`);
        }
        else if (props.variant !== undefined) {
            console.warn(`breeze-ui: Invalid button variant: '${props.variant}'. Defaulting to '${ButtonVariants[0]}'`);
            console.warn(`breeze-ui: Valid button variants are: ${Object.values(ButtonVariants).join(', ')}`);
        }
    }

    return ButtonVariants[0];
});

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

<!-- Default Styles -->
<style scoped>
.breeze-button {
    padding: var(--padding-8) var(--padding-16);
    border: none;
    border-radius: var(--border-radius-6);
    font-weight: 500;
    font-size: var(--font-size-small);
    color: var(--text-color);
    cursor: pointer;
    box-sizing: border-box;
    font-family: var(--font-family-main);
    display: inline-block;
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
.breeze-button--solid {
    background-color: var(--foreground);
    color: var(--text-background);
    transition: background-color 0.15s ease, color 0.15s ease;
}
.breeze-button--solid:hover {
    background-color: var(--foreground-hover);
}

/* Ghost Styles */
.breeze-button--ghost{
    background-color: transparent;
    color: var(--text-foreground);
    border: 1px solid var(--foreground);
}
.breeze-button--ghost {
    transition: color 0.15s ease, background-color 0.15s ease;
}
.breeze-button--ghost:hover {
    background-color: var(--foreground);
    color: var(--accent);
}
.breeze-button--ghost-flat {
    background-color: transparent;
    border: 1px solid var(--foreground);
    color: var(--foreground);
}
.breeze-button--ghost-flat:hover{
    border-color: var(--foreground-hover);
}
.breeze-button--ghost-flat .button-content {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.15s ease;
}
.breeze-button--ghost-flat:hover .button-content {
    border-bottom: 1px solid var(--foreground);
}
.breeze-button--ghost:hover {
    background-color: var(--foreground);
    color: var(--accent);
}

/* Flat Styles */
.breeze-button--flat {
    background-color: transparent;
    border: 1px solid transparent;
    color: var(--foreground);
}
.breeze-button--flat .button-content {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.15s ease;
}
.breeze-button--flat:hover .button-content {
    border-bottom: 1px solid var(--foreground);
}
</style>