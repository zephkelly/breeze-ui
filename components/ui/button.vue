<template>
    <component
        v-if="!to"
        :is="tag"
        :class="[
                { 'breeze-button': !unstyled },
                { [`breeze-button--${validatedVariant}`]: !unstyled },
                { 'breeze-button--loading': loading },
                { 'breeze-button--disabled': disabled },
                { 'breeze-button--active': isActive },
                { 'breeze-button--holdable': holdable },
                { 'breeze-button--bounce': bounce },
            ]"
            v-bind="$attrs"
            :disabled="disabled || loading"
            :aria-disabled="disabled || loading"
            :aria-busy="loading"
            :aria-label="ariaLabel"
            :aria-pressed="holdable ? isActive : undefined"
            tabindex="0"
            :href="href"
            role="button"
            @click="handleClick"
            @mousedown="handleDown"
            @mouseup="handleUp"
            @mouseleave="handleLeave"
            @keydown.space.prevent="handleKeyDown"
            @keyup.space.prevent="handleUp(); handleClick($event, true);"
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
                { 'breeze-button--disabled': disabled },
                { 'breeze-button--active': isActive },
                { 'breeze-button--holdable': holdable },
            ]"
            v-bind="$attrs"
            :disabled="disabled || loading"
            :aria-disabled="disabled || loading"
            :aria-busy="loading"
            :aria-label="ariaLabel"
            :aria-pressed="holdable ? isActive : undefined"
            :href="href"
            role="external-link"
            @click="handleClick"
            @mousedown="handleDown"
            @mouseup="handleUp"
            @mouseleave="handleLeave"
            @keydown.space.prevent="handleDown"
            @keyup.space.prevent="handleUp(); handleClick($event, true);"
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
import { debounceLeading, debounce } from './../../utils/debounce';

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
    (e: 'pressstart'): void
    (e: 'pressend'): void
}>();

const isTouch = ref(false);
const isActive = ref(false);

const handleClick = debounce((event: MouseEvent, keyboard: boolean) => {
    if (!props.disabled && !props.loading && (props.holdable !== undefined || keyboard)) {
        emit('click', event);
        console.log('click');
    }

    isTouch.value = false;
}, 100);

const handleDown = (event: MouseEvent) => {
    if (props.holdable && !props.disabled && !props.loading) {
        isActive.value = true;
        emit('pressstart');
    }
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ' && !props.disabled && !props.loading) {
        isActive.value = true;
        emit('pressstart');
    }
};

const handleUp = () => {
    if (props.holdable && !props.disabled && !props.loading) {
        isActive.value = false;
        emit('pressend');
    }
};

const handleLeave = () => {
    if (props.holdable && !props.disabled && !props.loading && isActive.value) {
        isActive.value = false;
        emit('pressend');
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
    height: 32px;
    color: var(--text-color);
    cursor: pointer;
    box-sizing: border-box;
    font-family: var(--font-family-main);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
}

.breeze-button:focus-visible {
    outline: 2px solid var(--focus-color);
    outline-offset: 2px;
}

.breeze-button--bounce.breeze-button--active,
.breeze-button--bounce.breeze-button:active {
    transform: translateY(1px);
}

@media (hover: hover) and (pointer: fine) {
    .breeze-button.breeze-button--bounce.breeze-button--holdable:active:not(.breeze-button--active) {
        transform: translate(0px);
    }
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
.breeze-button--solid:hover,
.breeze-button--solid:focus-visible,
.breeze-button--solid:active {
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
.breeze-button--ghost:hover,
.breeze-button--ghost:focus-visible
{
    background-color: var(--foreground);
    color: var(--text-background);
}
.breeze-button--ghost:active {
    background-color: var(--foreground-hover);
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

@media (hover: hover) and (pointer: fine) {
    .breeze-button--ghost:active:not(.breeze-button--active) {
        background-color: transparent;
        color: var(--text-foreground);
    }
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
.breeze-button--flat:hover .button-content,
.breeze-button--flat:focus-visible .button-content,
.breeze-button--flat:active .button-content {
    border-bottom: 1px solid var(--foreground);
}

@media (hover: hover) and (pointer: fine) {
    .breeze-button--flat:active:not(.breeze-button--active) {
        border-bottom: 1px solid transparent;
    }
}
</style>