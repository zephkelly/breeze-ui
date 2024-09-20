<template>
    <component
        v-if="!headless"
        :is="tag"
        ref="buttonRef"
        :class="buttonClasses"
            :style="[cursorStyle, colorStyle]"
            v-bind="a11yAttrs"
            :disabled="isDisabled"
            :aria-disabled="isDisabled"
            :aria-busy="loading"
            :aria-label="ariaLabel"
            tabindex="0"
            :href="href"
            role="button"
            @mousedown="handleDown"
            @mouseup="handleUp"
            @mouseleave="handleLeave"
            @touchstart.prevent="handleTouchStart"
            @touchend.prevent="handleTouchEnd"
            @touchcancel.prevent="handleTouchCancel"
            @keydown.space.prevent="handleKeyDown"
            @keyup.space.prevent="handleUp"
        >
        <slot :a11yAttrs="a11yAttrs">
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
        </slot>
    </component>
    <slot v-else :a11yAttrs="a11yAttrs" name="default">

    </slot>
</template>

<script setup lang="ts">
//@ts-ignore
import { NuxtLink } from '#components'
import { type ButtonProps, ButtonVariants, ButtonColors } from './../../types/button';
import { debounce } from './../../utils/debounce';

import { useButtonColor } from './../../composables/useButtonColor';
import { useDevelopmentWarning } from './../../composables/useDevelopmentWarning';

const props = defineProps<ButtonProps>();

const colorwayRef = ref(props.colorway)

const { colorStyle } = useButtonColor(colorwayRef);
const { devWarning } = useDevelopmentWarning();

const tag = computed(() => {
    if (props.to) return NuxtLink;
    if (props.href) return 'a';
    return 'button';
});

const isActive = ref(false);
const isActiveTimeout = ref<number | null>(null);

const touchStartTime = ref<number>(0);
const isTouchDevice = ref(false);

const isDisabled = computed(() => props.disabled || props.loading);
const cursorStyle = computed(() => ({ cursor: isDisabled.value ? 'not-allowed' : '' }))

const buttonClasses = computed(() => [
    { 'breeze-button': !props.unstyled },
    { [`breeze-button--${validatedVariant.value}`]: !props.unstyled },
    { 'breeze-button--colorway': !props.unstyled && props.colorway },
    { 'breeze-button--loading': props.loading },
    { 'breeze-button--disabled': props.disabled },
    { 'breeze-button--active': isActive.value },
    { 'breeze-button--holdable': props.holdable },
    { 'breeze-button--bounce': props.bounce }
])

const validatedVariant = computed(() => {
    if (props.variant !== undefined && Object.values(ButtonVariants).includes(props.variant)) {
        return props.variant;
    }

    if (import.meta.dev) {   
        if (props.variant as string === '') {
            devWarning(`Empty button variant. Defaulting to '${ButtonVariants[0]}'`);
            devWarning(`Valid button variants are: ${Object.values(ButtonVariants).join(', ')}`);
        }
        else if (props.variant !== undefined) {
            devWarning(`Invalid button variant: '${props.variant}'. Defaulting to '${ButtonVariants[0]}'`);
            devWarning(`Valid button variants are: ${Object.values(ButtonVariants).join(', ')}`);
        }
    }

    return ButtonVariants[0];
});


const ariaLabel = computed(() => {
    if (props.ariaLabel) {
        return props.ariaLabel;
    }
    
    return props.loading ? 'Loading' : undefined;
});

const a11yAttrs = computed(() => ({
    role: 'button',
    tabindex: 0,
    disabled: isDisabled.value,
    'aria-disabled': isDisabled.value,
    'aria-busy': props.loading,
    'aria-label': ariaLabel.value,
    onMousedown: (event: MouseEvent) => handleDown(event),
    onMouseup: (event: MouseEvent) => handleUp(event as unknown as KeyboardEvent),
    onMouseleave: handleLeave,
    onTouchstart: (event: TouchEvent) => {
        event.preventDefault();
        handleTouchStart(event);
    },
    onTouchend: (event: TouchEvent) => {
        event.preventDefault();
        handleTouchEnd(event);
    },
    onTouchcancel: (event: TouchEvent) => {
        event.preventDefault();
        handleTouchCancel();
    },
    onKeydown: (event: KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            handleKeyDown(event);
        }
    },
    onKeyup: (event: KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            handleUp(event);
        }
    }
}));

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
    (e: 'pressstart'): void
    (e: 'pressend'): void
}>();

const click = debounce((event: MouseEvent) => {
    emit('click', event);
}, 100);

function setActiveFlash() {
    isActive.value = true;
    isActiveTimeout.value = window.setTimeout(() => {
        isActive.value = false;
    }, 150);
}

const handleDown = (event: MouseEvent) => {
    if (props.disabled || props.loading) return;

    if (!props.holdable) {
        setActiveFlash();
        click(event);
    }
    else if (props.holdable) {
        isActive.value = true;
        emit('pressstart');
    }
};

const isKeyDownEnterOrSpace = ref(false);
const handleKeyDown = (event: KeyboardEvent) => {
    if (props.disabled || props.loading) return;
    if (event.key !== ' ') return;
    
    if (!props.holdable && !isKeyDownEnterOrSpace.value) {   
        setActiveFlash();
        click(event as unknown as MouseEvent);
    }

    if (isKeyDownEnterOrSpace.value === false) {
        isActive.value = true;
    }
    
    isKeyDownEnterOrSpace.value = true;
    

    emit('pressstart');
};

const handleTouchStart = (event: TouchEvent) => {
    isTouchDevice.value = true;
    if (props.disabled || props.loading) return;

    touchStartTime.value = Date.now();
    if (!props.holdable) {
        setActiveFlash();
        click(event as unknown as MouseEvent);
    }
    else {
        isActive.value = true;
    }

    emit('pressstart');
};

const handleTouchEnd = (event: TouchEvent) => {
    if (props.disabled || props.loading) return;

    if (props.holdable) {
        click(event);
        isActive.value = false;
    }

    emit('pressend');
};

const handleTouchCancel = () => {
    if (props.disabled || props.loading) return;
    
    isActive.value = false;

    if (props.holdable) {
        emit('pressend');
    }
};

const handleUp = (event: KeyboardEvent) => {
    if (props.disabled || props.loading) return;
    isKeyDownEnterOrSpace.value = false;
    
    if (props.holdable) {
        isActive.value = false;
        
        click(event as unknown as MouseEvent);
        emit('pressend');
    }
    
    if (!props.holdable) {
        isActive.value = false;
    }
};

const handleLeave = () => {
    if (props.disabled || props.loading) return;
    
    if (props.holdable && isActive.value) {
        isActive.value = false;
        emit('pressend');
    }
};

// Dev Checks
if (import.meta.dev) {
    if (props.headless) {
        if (props.bounce) {
            devWarning(`The 'bounce' prop is not supported when 'headless' is true.`);
        }

        if (props.holdable) {
            devWarning(`The 'holdable' prop is not supported when 'headless' is true.`);
        }

        if (props.variant) {
            devWarning(`The 'variant' prop is not supported when 'headless' is true.`);
        }

        if (props.colorway) {
            devWarning(`The 'colorway' prop is not supported when 'headless' is true.`);
        }
    }
}
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

.breeze-button--bounce.breeze-button--active {
    transform: translateY(1px);
}

.button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.content-main {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    white-space: nowrap;
    letter-spacing: 0.2px;
    font-weight: 500;
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
/* Solid */
.breeze-button--solid {
    background-color: var(--foreground);
    border: 1px solid var(--foreground);
    color: var(--text-background);
    transition: background-color 0.1s ease, color 0.1s ease;
}
.breeze-button--solid:hover,
.breeze-button--solid:focus-visible {
    background-color: var(--foreground-hover);
}
.breeze-button--solid:focus-visible {
    background-color: var(--background-active);
    color: var(--text-foreground);
    border-color: var(--text-foreground);
}
.breeze-button--solid.breeze-button--active {
    background-color: var(--foreground-active);
    border-color: var(--foreground-active);
    color: var(--text-background);
}
.breeze-button--solid.breeze-button--colorway {  /* Colorway */
    background-color: var(--colorway);
    border-color: var(--colorway);
    color: var(--colorway-text);
}
.breeze-button--solid.breeze-button--colorway:hover {
    background-color: var(--colorway-hover);
    border-color: var(--colorway-hover);
}
.breeze-button--solid.breeze-button--colorway:focus-visible { 
    background-color: var(--colorway-contrast-hover);
    color: var(--colorway-contrast-text);
    border-color: var(--colorway-hover);
}
.breeze-button--solid.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-active);
    border-color: var(--colorway-active);
    color: var(--colorway-text);
}
.breeze-button--solid.breeze-button--disabled {  /* Disabled */
    background-color: var(--disabled-background);
    border-color: var(--disabled-background);
    color: var(--disabled-foreground);
}
.breeze-button--solid.breeze-button--disabled:hover {
    background-color: var(--disabled-background);
    border-color: var(--disabled-background);
    color: var(--disabled-foreground);
}

/* Solid - Ghost */
.breeze-button--solid-ghost {
    border: 1px solid var(--foreground);
    color: var(--text-background);
    background-color: var(--foreground);
    transition: background-color 0.1s ease, color 0.1s ease;
}
.breeze-button--solid-ghost:hover,
.breeze-button--solid-ghost:focus-visible {
    background-color: var(--background-hover);
    color: var(--text-foreground);
}
.breeze-button--solid-ghost.breeze-button--active {
    background-color: var(--background-active);
    color: var(--text-foreground);
}
.breeze-button--solid-ghost.breeze-button--colorway {  /* Colorway */
    background-color: var(--colorway);
    border-color: var(--colorway);
    color: var(--colorway-text);
}
.breeze-button--solid-ghost.breeze-button--colorway:focus-visible,
.breeze-button--solid-ghost.breeze-button--colorway:hover {
    background-color: var(--colorway-contrast-hover);
    color: var(--colorway-contrast-text);
    border-color: var(--colorway-contrast-text);
}
.breeze-button--solid-ghost.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast-active);
    color: var(--colorway-contrast-text);
    border-color: var(--colorway-contrast-text); 
}
.breeze-button--solid-ghost.breeze-button--disabled {  /* Disabled */
    background-color: var(--disabled-background);
    border-color: var(--disabled-background);
    color: var(--disabled-foreground);
}
.breeze-button--solid-ghost.breeze-button--disabled:hover {
    background-color: var(--disabled-background);
    border-color: var(--disabled-background);
    color: var(--disabled-foreground);
}

/* Solid - Flat */
.breeze-button--solid-flat {
    background-color: var(--foreground);
    border: 1px solid var(--foreground);
    color: var(--text-background);
    transition: background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--solid-flat .button-content {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.1s ease;
}
.breeze-button--solid-flat:hover {
    background-color: transparent;
    color: var(--text-foreground);
    border-color: transparent;
}
.breeze-button--solid-flat:hover .button-content {
    border-color: var(--text-foreground);
}
.breeze-button--solid-flat:focus-visible {
    background-color: transparent;
    color: var(--text-foreground);
}
.breeze-button--solid-flat:focus-visible .button-content {
    border-color: var(--text-foreground);
}
.breeze-button--solid-flat.breeze-button--active {
    background-color: var(--background-hover);
    color: var(--text-foreground); 
}
.breeze-button--solid-flat.breeze-button--active .button-content {
    border-color: var(--text-foreground);
}
.breeze-button--solid-flat.breeze-button--colorway {  /* Colorway */
    background-color: var(--colorway);
    border-color: var(--colorway);
    color: var(--colorway-text);
}
.breeze-button--solid-flat.breeze-button--colorway:hover {
    background-color: transparent;
    color: var(--colorway-contrast-text);
    border-color: transparent;
}
.breeze-button--solid-flat.breeze-button--colorway:focus-visible {
    background-color: transparent;
    border-color: transparent;
    color: var(--colorway-contrast-text);
}
.breeze-button--solid-flat.breeze-button--colorway:hover .button-content,
.breeze-button--solid-flat.breeze-button--colorway:focus-visible .button-content {
    border-color: var(--colorway-contrast-text);
}
.breeze-button--solid-flat.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast);
    color: var(--colorway-contrast-text);
}
.breeze-button--solid-flat.breeze-button--colorway.breeze-button--active .button-content {
    border-color: var(--colorway-contrast-text);
}
.breeze-button--solid-flat.breeze-button--disabled {  /* Disabled */
    background-color: var(--disabled-background);
    border-color: var(--disabled-background);
    color: var(--disabled-foreground);
}
.breeze-button--solid-flat.breeze-button--disabled:hover {
    background-color: var(--disabled-background);
    border-color: var(--disabled-background);
    color: var(--disabled-foreground);
}
.breeze-button--solid-flat.breeze-button--disabled:hover .button-content,
.breeze-button--solid-flat.breeze-button--disabled:focus-visible .button-content {
    border-color: transparent;
}

/* Ghost */
.breeze-button--ghost,
.breeze-button--ghost-solid {
    background-color: transparent;
    color: var(--text-foreground);
    border: 1px solid var(--foreground);
}
.breeze-button--ghost,
.breeze-button--ghost-solid {
    transition: color 0.15s ease, background-color 0.15s ease;
}
.breeze-button--ghost .button-content {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.1s ease;
}
.breeze-button--ghost:hover,
.breeze-button--ghost:focus-visible {
    background-color: var(--background-hover);
}
.breeze-button--ghost.breeze-button--active {
    background-color: var(--background-active);
}
.breeze-button--ghost.breeze-button--colorway {  /* Colorway */
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast-text);
    color: var(--colorway-contrast-text);
}
.breeze-button--ghost.breeze-button--colorway:hover {
    background-color: var(--colorway-contrast-hover);
}
.breeze-button--ghost.breeze-button--colorway:focus-visible .button-content {
    border-color: var(--colorway-contrast-text);
}
.breeze-button--ghost.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast-active);
}
.breeze-button--ghost.breeze-button--disabled {  /* Disabled */
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-text);
    color: var(--disabled-foreground-text);
}
.breeze-button--ghost.breeze-button--disabled:hover {
    background-color: var(--disabled-foreground-hover);
}
.breeze-button--ghost.breeze-button--disabled:focus-visible .button-content {
    border-color: transparent;
}

/* Ghost - Solid */
.breeze-button--ghost-solid:hover {
    background-color: var(--foreground-hover);
    color: var(--text-background);
    border-color: var(--foreground-hover);
}
.breeze-button--ghost-solid:focus-visible {
    background-color: var(--background-hover);
    color: var(--text-foreground);
}
.breeze-button--ghost-solid.breeze-button--active {
    background-color: var(--foreground-active);
    border-color: var(--foreground-active);
    color: var(--text-background);
}
.breeze-button--ghost-solid.breeze-button--colorway {  /* Colorway */
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast-text);
    color: var(--colorway-contrast-text);
}
.breeze-button--ghost-solid.breeze-button--colorway:focus-visible {
    background-color: var(--colorway-contrast-hover);
}
.breeze-button--ghost-solid.breeze-button--colorway:hover {
    background-color: var(--colorway-hover);
    border-color: var(--colorway-hover);
    color: var(--colorway-text);
}
.breeze-button--ghost-solid.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-active);
    color: var(--colorway-text);
}
.breeze-button--ghost-solid.breeze-button--disabled {  /* Disabled */
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-text);
    color: var(--disabled-foreground-text);
}
.breeze-button--ghost-solid.breeze-button--disabled:hover {
    background-color: var(--disabled-foreground-hover);
    color: var(--disabled-foreground-text);
}
.breeze-button--ghost-solid.breeze-button--disabled:focus-visible .button-content {
    border-color: transparent;
}

/* Ghost-Flat */
.breeze-button--ghost-flat {
    background-color: transparent;
    border: 1px solid var(--foreground);
    color: var(--foreground);
    transition: background-color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--ghost-flat .button-content {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.1s ease;
}
.breeze-button--ghost-flat:hover,
.breeze-button--ghost-flat:focus-visible {
    border-color: transparent;
}
.breeze-button--ghost-flat:hover .button-content,
.breeze-button--ghost-flat:focus-visible .button-content {
    border-color: var(--text-foreground);
}
.breeze-button--ghost-flat.breeze-button--active {
    background-color: var(--background-hover);
    color: var(--foreground);
}
.breeze-button--ghost-flat.breeze-button--active .button-content {
    border-color: var(--text-foreground);
}
.breeze-button--ghost-flat.breeze-button--colorway {  /* Colorway */
    background-color: var(--colorway-contrast);
    border-color: var(--colorway);
    color: var(--colorway-contrast-text);
}
.breeze-button--ghost-flat.breeze-button--colorway:hover .button-content,
.breeze-button--ghost-flat.breeze-button--colorway:focus-visible .button-content {
    border-color: var(--colorway-contrast-text);
}
.breeze-button--ghost-flat.breeze-button--colorway:hover {
    background-color: transparent;
    border-color: transparent;
}
.breeze-button--ghost-flat.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast);
}
.breeze-button--ghost-flat.breeze-button--colorway.breeze-button--active .button-content {
    border-color: var(--colorway-contrast-text);
}
.breeze-button--ghost-flat.breeze-button--disabled {  /* Disabled */
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-text);
    color: var(--disabled-foreground-text);
}
.breeze-button--ghost-flat.breeze-button--disabled:hover {
    background-color: var(--disabled-foreground-hover);
    border-color: var(--disabled-foreground-text);
    color: var(--disabled-foreground-text);
}
.breeze-button--ghost-flat.breeze-button--disabled:hover .button-content {
    border-color: transparent;
}
.breeze-button--ghost-flat.breeze-button--disabled:focus-visible .button-content {
    border-color: transparent;
}


/* Flat Styles */
.breeze-button--flat {
    background-color: transparent;
    border: 1px solid transparent;
    color: var(--foreground);
    transition: background-color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--flat .button-content {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.1s ease;
}
.breeze-button--flat.breeze-button--active {
    background-color: var(--background-hover);
    border-color: var(--background-hover);
}
.breeze-button--flat:hover .button-content,
.breeze-button--flat:focus-visible .button-content {
    border-color: var(--foreground);
}
.breeze-button--flat.breeze-button--colorway {
    color: var(--colorway-contrast-text);
}
.breeze-button--flat.breeze-button--colorway:hover .button-content,
.breeze-button--flat.breeze-button--colorway:focus-visible .button-content,
.breeze-button--flat.breeze-button--colorway.breeze-button--active .button-content {   /* Colorway */
    border-color: var(--colorway-contrast-text);
}
.breeze-button--flat.breeze-button--colorway:hover {
    color: var(--colorway-contrast-text);
}
.breeze-button--flat.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast);
}
.breeze-button--flat.breeze-button--disabled {  /* Disabled */
    color: var(--disabled-foreground-text);
}
.breeze-button--flat.breeze-button--disabled:hover {
    color: var(--disabled-foreground-text);
}
.breeze-button--flat.breeze-button--disabled:hover .button-content {
    border-color: transparent;
}

/* Flat - Ghost */
.breeze-button--flat-ghost {
    background-color: transparent;
    border: 1px solid transparent;
    color: var(--foreground);
    transition: background-color 0.1s ease;
}
.breeze-button--flat-ghost:hover,
.breeze-button--flat-ghost:focus-visible {
    background-color: var(--background-hover);
    border-color: var(--foreground);
}
.breeze-button--flat-ghost.breeze-button--active {
    background-color: var(--background-active);
}
.breeze-button--flat-ghost.breeze-button--colorway {  /* Colorway */
    color: var(--colorway-contrast-text);
}
.breeze-button--flat-ghost.breeze-button--colorway:focus-visible {
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast-text);    
}
.breeze-button--flat-ghost.breeze-button--colorway:hover {
    background-color: var(--colorway-contrast-hover);
    border-color: var(----colorway-contrast-text);
}
.breeze-button--flat-ghost.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast-active);
    border-color: var(--colorway-contrast-text);
}
.breeze-button--flat-ghost.breeze-button--disabled {  /* Disabled */
    color: var(--disabled-foreground-text);
}
.breeze-button--flat-ghost.breeze-button--disabled:hover {
    color: var(--disabled-foreground-text);
    background-color: transparent;
    border-color: transparent;
}
.breeze-button--flat-ghost.breeze-button--disabled:hover .button-content {
    border-color: transparent;
}

/* Flat-Static */
.breeze-button--flat-static {
    background-color: transparent;
    border: 1px solid transparent;
    color: var(--foreground);
}
.breeze-button--flat-static:focus-visible {
    background-color: var(--background-hover);
}
.breeze-button--flat-static .button-content {
    border-bottom: 1px solid var(--foreground);
    transition: border-bottom 0.1s ease;
}
.breeze-button--flat-static.breeze-button--colorway {  /* Colorway */
    color: var(--colorway-contrast-text);
}
.breeze-button--flat-static.breeze-button--colorway:focus-visible {
    background-color: var(--colorway-contrast);
    border-color: var(--colorway-contrast-text); 
}
.breeze-button--flat-static.breeze-button--colorway .button-content {
    border-color: var(--colorway-contrast-text);
}
.breeze-button--flat-static.breeze-button--disabled {  /* Disabled */
    color: var(--disabled-foreground-text);
}
.breeze-button--flat-static.breeze-button--disabled:hover {
    color: var(--disabled-foreground-text);
}
.breeze-button--flat-static.breeze-button--disabled .button-content {
    border-color: var(--disabled-foreground-text);
}
.breeze-button--flat-static.breeze-button--disabled:hover .button-content {
    border-color: var(--disabled-foreground-text);
}
</style>