<template>
    <BaseButton 
        v-bind="props"
        :class="buttonClasses"
        @click="$emit('click', $event)"
        @pressstart="$emit('pressstart')"
        @pressend="$emit('pressend')"
        v-slot="props"
    >
        <slot v-if="headless" :attributes="props.attributes" v-bind="props.attributes"> </slot>
        <div class="button-content" v-else-if="!loading">
            <span v-if="$slots['leading']" class="content-left" aria-hidden="true"> 
                <slot name="leading"></slot>
            </span>
            <span class="content-main">
                <div class="button-icon" v-if="icon">
                    <slot></slot>
                </div>
                <div class="button-text" v-else>
                    <slot></slot>
                </div>
            </span>
            <span v-if="$slots['trailing']" class="content-right" aria-hidden="true">
                <slot name="trailing"></slot>
            </span>
        </div>
        <span v-else class="button-loader" aria-hidden="true">
            <slot name="loader">Loading...</slot>
            <slot name="default"/>
        </span>
    </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from './base/BaseButton.vue';
import { type ButtonProps, type ButtonVariant, type ButtonSize, type ButtonShape, type ButtonColor } from './../../../types/button';

const props = withDefaults(defineProps<ButtonProps>(), {
    holdable: false,
    debounce: true,
    size: 'small',
})

const buttonClasses = computed(() => [
    { 'breeze-button': !props.unstyled },
    { [`breeze-button--${props.variant}`]: !props.unstyled && props.variant },
//     { 'breeze-button--full': !props.unstyled && props.width === 'full' },
//     { 'breeze-button--color': !props.unstyled && props.color },
//     { [`breeze-button--color-${props.color}`]: !props.unstyled && props.color},
//     { 'breeze-button--holdable': props.holdable },
//     { 'breeze-button--bounce': !props.unstyled && props.bounce },
//     { 'breeze-button--compact': !props.unstyled && props.compact },
//     { 'breeze-button--invert': !props.unstyled && props.invert },
//     { [`breeze-button--${props.shape}`]: !props.unstyled && props.shape },
//     { [`breeze-button--size-${props.size}`]: !props.unstyled && props.size }
])

const buttonHeight = computed(() => {
    switch (props.size) {
        case 'tiny': return '28px';
        case 'small': return '32px';
        case 'medium': return '38px';
        case 'large': return '44px';
        default: return '38px';
    }
});

const buttonPadding = computed(() => {
    switch (props.size) {
        case 'tiny': return '0.25rem 0.5rem';
        case 'small': return '0.375rem 0.75rem';
        case 'medium': return '0.5rem 1rem';
        case 'large': return '0.625rem 1.25rem';
        default: return '0.5rem 1rem';
    }
});

const fontSize = computed(() => {
    switch (props.size) {
        case 'tiny': return '0.75rem';
        case 'small': return '0.875rem';
        case 'medium': return '1rem';
        case 'large': return '1.125rem';
        default: return '1rem';
    }
});

const colors = computed(() => {
    const colorMap = {
        primary: { background: '#3490dc', text: '#ffffff', hover: '#2779bd', active: '#1c6da8' },
        secondary: { background: '#f6993f', text: '#ffffff', hover: '#f4810f' },
        red: { 
            background: '#e3342f',
            text: 'var(--red-100)',
            hover: '#cc1f1a'
        },
        green: { background: '#38c172', text: '#ffffff', hover: '#2f9e62' },
        blue: { background: '#3490dc', text: '#ffffff', hover: '#2779bd' },
    };

    const propColor = props.color || 'primary';
    return colorMap[propColor] || colorMap.primary;
    
});

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
    (e: 'pressstart'): void
    (e: 'pressend'): void
}>();
</script>

<style scoped>
.breeze-button {
    height: v-bind(buttonHeight);
    padding: v-bind(buttonPadding);
    font-size: v-bind(fontSize);
    border-radius: 0.25rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.1s, color 0.1s, border-color 0.1s;
}

.breeze-button--solid {
    background-color: v-bind('colors.background');
    color: v-bind('colors.text');
    border: none;
}

.breeze-button--solid:hover:not(:disabled) {
    background-color: v-bind('colors.hover');
}

.breeze-button--ghost {
    background-color: transparent;
    color: v-bind('colors.background');
    border: 1px solid v-bind('colors.background');
}

.breeze-button--ghost:hover:not(:disabled) {
    background-color: v-bind('colors.background');
    color: v-bind('colors.text');
}

.breeze-button--flat {
    background-color: transparent;
    color: v-bind('colors.background');
    border: none;
}

.breeze-button--flat:hover:not(:disabled) {
    background-color: v-bind('colors.background');
    color: v-bind('colors.text');
}

.breeze-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.breeze-button--loading {
    opacity: 0.8;
    cursor: wait;
}
</style>

<!-- 
<style scoped>
.breeze-button {
    padding: var(--padding-6) var(--padding-12);
    border-radius: var(--border-radius-6);
    font-size: var(--font-size-small);
    color: var(--text-background);
    cursor: pointer;
    box-sizing: border-box;
    font-family: var(--font-family-main);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
    height: auto;
    max-width: max-content;
}

.breeze-button:focus-visible {
    outline: 2px solid var(--foreground);
    /* outline-offset: 3px; */
    /* inset that is the background color */
    box-shadow: 0 0 0 5px var(--background);    
}

.breeze-button--bounce.breeze-button--active {
    transform: translateY(1px);
}

.breeze-button--full {
    width: 100%;
}

.breeze-button--rounded {
    border-radius: var(--border-radius-16);
}

.breeze-button--round {
    border-radius: var(--border-radius-full);
    padding: var(--padding-6);
}

.breeze-button--sharp {
    border-radius: 0;
}

.breeze-button--size-tiny {
    font-size: var(--font-size-tiny);
    padding: var(--padding-6) var(--padding-12);
}
.breeze-button--size-tiny.breeze-button--compact {
    height: 28px;
    max-height: 28px;
}

.breeze-button--size-tiny,
.breeze-button--size-small.breeze-button--compact {
    height: 30px;
    max-height: 30px;
}

.breeze-button--size-small {
    font-size: var(--font-size-small);
    padding: var(--padding-8) var(--padding-16);
}
.breeze-button--size-small,
.breeze-button--size-medium.breeze-button--compact {
    height: 34px;
    max-height: 34px;
}

.breeze-button--size-medium {
    font-size: var(--font-size-medium);
    padding: var(--padding-12) var(--padding-20);
}
.breeze-button--size-medium,
.breeze-button--size-large.breeze-button--compact{
    height: 38px;
    max-height: 38px;
}

.breeze-button--size-large {
    height: 42px;
    max-height: 42px;
    font-size: var(--font-size-large);
    padding: var(--padding-16) var(--padding-20);
}

.breeze-button--icon-only {
    aspect-ratio: 1/1;
    padding: 0;
}

.button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: 100%;
    width: 100%;
}

.content-main {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    white-space: nowrap;
    letter-spacing: 0.2px;
    font-weight: 600;
}
.button-icon,
.button-text {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.content-left,
.content-right {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    aspect-ratio: 1/1;
}
:deep(.content-left svg), :deep(.content-right svg) {
    position: relative;
    width: 95%;
    height: 95%;
}

:deep(.button-icon svg), :deep(.button-text svg) {
    position: relative;
    width: 95%;
    height: 95%;
}
</style>

<style scoped>
/* Solid Variant Styles */
/* Resting State */
.breeze-button--solid,
.breeze-button--solid-ghost,
.breeze-button--solid-flat {
    color: var(--text-background);
    background-color: var(--foreground);
    border: var(--button-border-width) solid var(--foreground);
    transition: background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--solid.breeze-button--color,
.breeze-button--solid-ghost.breeze-button--color,
.breeze-button--solid-flat.breeze-button--color {
    background-color: var(--color-900);
    border-color: var(--color-900);
    color: var(--text-background);
}
.breeze-button--solid.breeze-button--color.breeze-button--invert,
.breeze-button--solid-ghost.breeze-button--color.breeze-button--invert,
.breeze-button--solid-flat.breeze-button--color.breeze-button--invert {
    background-color: var(--color-900-invert);
    border-color: var(--color-900-invert);
    color: var(--text-foreground);
}

/* Hover/Focus State */
.breeze-button--solid:hover,
.breeze-button--ghost-solid:hover,
.breeze-button--flat-solid:hover,
.breeze-button--solid:focus-visible,
.breeze-button--ghost-solid:focus-visible,
.breeze-button--flat-solid:focus-visible {
    background-color: var(--foreground-hover);
    border-color: var(--foreground-hover);
    color: var(--text-background);
}
.breeze-button--solid.breeze-button--color:hover,
.breeze-button--ghost-solid.breeze-button--color:hover,
.breeze-button--flat-solid.breeze-button--color:hover,
.breeze-button--solid.breeze-button--color:focus-visible,
.breeze-button--ghost-solid.breeze-button--color:focus-visible,
.breeze-button--flat-solid.breeze-button--color:focus-visible {
    background-color: var(--color-800);
    border-color: var(--color-800);
    color: var(--text-background);
}

/* Active State */
.breeze-button--solid.breeze-button--active,
.breeze-button--ghost-solid.breeze-button--active,
.breeze-button--flat-solid.breeze-button--active {
    background-color: var(--foreground-active);
    border-color: var(--foreground-active);
}
.breeze-button--solid.breeze-button--color.breeze-button--active,
.breeze-button--ghost-solid.breeze-button--color.breeze-button--active,
.breeze-button--flat-solid.breeze-button--color.breeze-button--active {
    background-color: var(--color-900);
    border-color: var(--color-900);
}

/* Disabled State */
.breeze-button--solid.breeze-button--disabled,
.breeze-button--ghost-solid.breeze-button--disabled,
.breeze-button--flat-solid.breeze-button--disabled,
.breeze-button--solid.breeze-button--disabled:hover,
.breeze-button--ghost-solid.breeze-button--disabled:hover,
.breeze-button--flat-solid.breeze-button--disabled:hover {
    color: var(--disabled-foreground-text);
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-hover);
}



/* Ghost Variant Styles */
.breeze-button--ghost,
.breeze-button--ghost-solid,
.breeze-button--ghost-flat {
    background-color: transparent;
    color: var(--text-foreground);
    border: var(--button-border-width) solid var(--foreground);
    transition: color 0.1s ease, background-color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--ghost.breeze-button--color,
.breeze-button--ghost-solid.breeze-button--color,
.breeze-button--ghost-flat.breeze-button--color {
    background-color: var(--color-100);
    border-color: var(--color-900);
    color: var(--color-900);
}

/* Hover/Focus State */
.breeze-button--ghost:hover,
.breeze-button--solid-ghost:hover,
.breeze-button--flat-ghost:hover,
.breeze-button--ghost:focus-visible,
.breeze-button--solid-ghost:focus-visible,
.breeze-button--flat-ghost:focus-visible {
    color: var(--text-foreground);
    background-color: var(--background-hover);
    border-color: var(--text-foreground);
}
.breeze-button--ghost.breeze-button--color:hover,
.breeze-button--solid-ghost.breeze-button--color:hover,
.breeze-button--flat-ghost.breeze-button--color:hover,
.breeze-button--ghost.breeze-button--color:focus-visible,
.breeze-button--solid-ghost.breeze-button--color:focus-visible,
.breeze-button--flat-ghost.breeze-button--color:focus-visible {
    background-color: var(--color-200);
    color: var(--color-900);
    border-color: var(--color-900);
}

/* Active State */
.breeze-button--ghost.breeze-button--active,
.breeze-button--solid-ghost.breeze-button--active,
.breeze-button--flat-ghost.breeze-button--active {
    background-color: var(--background-active);
}
.breeze-button--ghost.breeze-button--color.breeze-button--active,
.breeze-button--solid-ghost.breeze-button--color.breeze-button--active,
.breeze-button--flat-ghost.breeze-button--color.breeze-button--active {
    background-color: var(--color-300);
}

/* Disabled State */
.breeze-button--ghost.breeze-button--disabled,
.breeze-button--solid-ghost.breeze-button--disabled,
.breeze-button--flat-ghost.breeze-button--disabled,
.breeze-button--ghost.breeze-button--disabled:hover,
.breeze-button--solid-ghost.breeze-button--disabled:hover,
.breeze-button--flat-ghost.breeze-button--disabled:hover {
    color: var(--disabled-foreground-text);
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-text);
}


/* Flat Variant Styles */
.breeze-button--flat,
.breeze-button--flat-static,
.breeze-button--flat-solid,
.breeze-button--flat-ghost {
    color: var(--text-foreground);
    border: var(--button-border-width) solid transparent;
    background-color: transparent;
    transition: color 0.1s ease, background-color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--flat-static .button-content {
    border-bottom: 1px solid var(--foreground);
}
.breeze-button--flat.breeze-button--color,
.breeze-button--flat-solid.breeze-button--color,
.breeze-button--flat-ghost.breeze-button--color,
.breeze-button--flat-static.breeze-button--color {
    color: var(--color-900);
}
.breeze-button--flat-static .button-content {
    border-color: var(--color-900);
}

/* Hover/Focus State */
.breeze-button--flat:hover,
.breeze-button--solid-flat:hover,
.breeze-button--ghost-flat:hover,
.breeze-button--flat:focus-visible,
.breeze-button--solid-flat:focus-visible,
.breeze-button--ghost-flat:focus-visible {
    color: var(--text-foreground);
    border-color: var(--background-hover);
    background-color: var(--background-hover);
}
.breeze-button--flat.breeze-button--color:hover,
.breeze-button--solid-flat.breeze-button--color:hover,
.breeze-button--ghost-flat.breeze-button--color:hover,
.breeze-button--flat.breeze-button--color:focus-visible,
.breeze-button--solid-flat.breeze-button--color:focus-visible,
.breeze-button--ghost-flat.breeze-button--color:focus-visible {
    color: var(--color-900);
    background-color: var(--color-200);
    border-color: transparent;
}

/* Hover/Focus State for inner button content (content underline) */
.breeze-button--flat:hover .button-content,
.breeze-button--solid-flat:hover .button-content,
.breeze-button--ghost-flat:hover .button-content,
.breeze-button--flat:focus-visible .button-content,
.breeze-button--solid-flat:focus-visible .button-content,
.breeze-button--ghost-flat:focus-visible .button-content {
    border-color: var(--foreground);
}

/* Active State */
.breeze-button--flat.breeze-button--active,
.breeze-button--solid-flat.breeze-button--active,
.breeze-button--ghost-flat.breeze-button--active {
    background-color: var(--background-active);
    border-color: var(--background-active);
}
.breeze-button--flat.breeze-button--color.breeze-button--active,
.breeze-button--solid-flat.breeze-button--color.breeze-button--active,
.breeze-button--ghost-flat.breeze-button--color.breeze-button--active {
    background-color: var(--color-300);
}

/* Disabled State */
.breeze-button--flat.breeze-button--disabled,
.breeze-button--flat-static.breeze-button--disabled,
.breeze-button--solid-flat.breeze-button--disabled,
.breeze-button--ghost-flat.breeze-button--disabled,
.breeze-button--flat.breeze-button--disabled:hover,
.breeze-button--solid-flat.breeze-button--disabled:hover,
.breeze-button--ghost-flat.breeze-button--disabled:hover {
    color: var(--disabled-foreground-text);
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-hover);
}
.breeze-button--flat-static.breeze-button--disabled {
    background-color: transparent;
    border-color: transparent;
}

/* Disabled State for inner button content */
.breeze-button--flat-static.breeze-button--disabled .button-content {
    border-color: var(--disabled-foreground-text);
}
</style> -->