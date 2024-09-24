<template>
    <component
        v-if="!headless"
        :is="tag"
        ref="buttonRef"
        :class="buttonClasses"
        :style="[cursorStyle, colorProperties]"
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
        <slot name="prebuilt" :a11yAttrs="a11yAttrs">
            <div class="button-content" v-if="!loading">
                <span v-if="$slots['leading']" class="breeze-button-icon left" aria-hidden="true"> 
                    <slot name="leading"></slot>
                </span>
                <span class="content-main" ref="contentMainRef">
                    <div class="button-icon" v-if="icon">
                        <slot name="default"></slot>
                    </div>
                    <div class="button-text" v-else>
                        <slot name="default"></slot>
                    </div>
                </span>
                <span v-if="$slots['trailing']" class="breeze-button-icon right" aria-hidden="true">
                    <slot name="trailing"></slot>
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
import { type ButtonProps, ButtonVariants, ButtonSizes, ButtonWidths } from '../../types/button';
import { debounce } from '../../utils/debounce';

import { useButtonColor } from '../../composables/useButtonColor';
import { useDevelopmentWarning } from '../../composables/useDevelopmentWarning';

const { colorProperties, calculateColor } = useButtonColor();
const { devWarning } = useDevelopmentWarning();

const { $currentColorScheme } = useNuxtApp();

const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'medium',
    variant: 'solid',
});

const buttonRef = ref<HTMLElement | null>(null);

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
const cursorStyle = computed(() => ({ cursor: isDisabled.value ? 'not-allowed' : undefined }))

const buttonClasses = computed(() => [
    { 'breeze-button': !props.unstyled },
    { [`breeze-button--${validatedVariant.value}`]: !props.unstyled },
    { 'breeze-button--full': !props.unstyled && validatedWidth.value === 'full' },
    { 'breeze-button--colorway': !props.unstyled && props.color },
    { [`breeze-button--colorway-${validatedColor.value}`]: !props.unstyled && props.color },
    { 'breeze-button--loading': props.loading },
    { 'breeze-button--disabled': props.disabled || props.loading },
    { 'breeze-button--active': !props.unstyled && isActive.value },
    { 'breeze-button--holdable': props.holdable },
    { 'breeze-button--bounce': !props.unstyled && props.bounce },
    { 'breeze-button--rounded': !props.unstyled && props.rounded },
    { 'breeze-button--round': !props.unstyled && props.round },
    { 'breeze-button--sharp': !props.unstyled && props.sharp },
    { 'breeze-button--icon-only': !props.unstyled && props.icon },
    { [`breeze-button--size-${validatedSize.value}`]: !props.unstyled && props.size }
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

const validatedWidth = computed(() => {
    if (props.width !== undefined && Object.values(ButtonWidths).includes(props.width)) {
        return props.width;
    }

    if (import.meta.dev) {
        if (props.width as string === '') {
            devWarning(`Empty button width. Defaulting to '${ButtonWidths[0]}'`);
            devWarning(`Valid button widths are: ${Object.values(ButtonWidths).join(', ')}`);
        }
        else if (props.width !== undefined) {
            devWarning(`Invalid button width: '${props.width}'. Defaulting to '${ButtonWidths[0]}'`);
            devWarning(`Valid button widths are: ${Object.values(ButtonWidths).join(', ')}`);
        }
    }

    return 'auto';
});

const validatedSize = computed(() => {
    if (props.size !== undefined && Object.values(ButtonSizes).includes(props.size)) {
        return props.size;
    }

    if (import.meta.dev) {
        if (props.size as string === '') {
            devWarning(`Empty button size. Defaulting to '${ButtonSizes[0]}'`);
            devWarning(`Valid button sizes are: ${Object.values(ButtonSizes).join(', ')}`);
        }
        else if (props.size !== undefined) {
            devWarning(`Invalid button size: '${props.size}'. Defaulting to '${ButtonSizes[0]}'`);
            devWarning(`Valid button sizes are: ${Object.values(ButtonSizes).join(', ')}`);
        }
    }

    return ButtonSizes[0];
});

const validatedColor = computed(() => {
    if (props.color !== undefined && Object.values(ButtonColors).includes(props.color)) {
        return props.color;
    }

    if (import.meta.dev) {
        if (props.color as string === '') {
            devWarning(`Empty button color. Defaulting to no color.`);
            devWarning(`Valid button colors are: ${Object.values(ButtonColors).join(', ')}`);
        }
        else if (props.color !== undefined) {
            devWarning(`Invalid button color: '${props.color}'. Defaulting to no color.`);
            devWarning(`Valid button colors are: ${Object.values(ButtonColors).join(', ')}`);
        }
    }

    return undefined;
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

watch(validatedColor, () => {
    calculateColor(validatedColor.value);
}, { immediate: true })

watch($currentColorScheme, () => {
    calculateColor(validatedColor.value);
}, { immediate: true })

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

        if (props.color) {
            devWarning(`The 'color' prop is not supported when 'headless' is true.`);
        }
    }

    if (props.sharp && props.rounded) {
        devWarning(`Conflicting prop types: 'sharp' and 'rounded'. Defaulting to 'sharp'.`);
    }
}
</script>

<style scoped>
.breeze-button {
    padding: var(--padding-6) var(--padding-12);
    border: none;
    border-radius: var(--border-radius-6);
    font-size: var(--font-size-small);
    color: var(--text-foreground);
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
    outline: none;
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

.breeze-button--icon-only {
    aspect-ratio: 1;
    padding: var(--padding-6);
}

.breeze-button--size-tiny {
    height: 26px;
    max-height: 26px;
    font-size: var(--font-size-tiny);
}
.breeze-button--size-tiny.breeze-button--icon-only {
    padding: var(--padding-4);
}

.breeze-button--size-small {
    height: 28px;
    max-height: 28px;
    font-size: var(--font-size-small);
    padding: var(--padding-6) var(--padding-12);
}
.breeze-button--size-small.breeze-button--icon-only {
    padding: var(--padding-4);
}

.breeze-button--size-medium {
    height: 32px;
    max-height: 32px;
    font-size: var(--font-size-medium);
}
.breeze-button--size-medium.breeze-button--icon-only {
    padding: var(--padding-4);
}

.breeze-button--size-large {
    height: 34px;
    max-height: 34px;
    font-size: var(--font-size-large);
    padding: var(--padding-6) var(--padding-12);
}
.breeze-button--size-large.breeze-button--icon-only {
    padding: var(--padding-4);
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
    white-space: nowrap;
    letter-spacing: 0.2px;
    font-weight: 500;
}

.button-icon,
.button-text {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    width: 100%;
}
.button-text {
    font-weight: 600;
}

.breeze-button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

:deep(.breeze-button-icon svg) {
    height: 100%;
    width: auto;
    aspect-ratio: 1;
    position: relative;
}

:deep(.button-icon svg) {
    position: relative;
    top: 0.3px;
    width: 100%;
    height: 100%;
}
</style>

<style scoped>
.breeze-button--solid,
.breeze-button--solid-ghost,
.breeze-button--solid-flat {
    color: var(--text-background);
    background-color: var(--foreground);
    border: var(--border-width) solid var(--foreground);
    transition: background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--solid.breeze-button--colorway,
.breeze-button--solid-ghost.breeze-button--colorway,
.breeze-button--solid-flat.breeze-button--colorway {
    background-color: var(--colorway);
    border-color: var(--colorway);
    color: var(--colorway-contrast-text);
}

/* Solid Hover/Focus */
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
.breeze-button--solid.breeze-button--colorway:hover,
.breeze-button--ghost-solid.breeze-button--colorway:hover,
.breeze-button--flat-solid.breeze-button--colorway:hover,
.breeze-button--solid.breeze-button--colorway:focus-visible,
.breeze-button--ghost-solid.breeze-button--colorway:focus-visible,
.breeze-button--flat-solid.breeze-button--colorway:focus-visible {
    background-color: var(--colorway-hover);
    border-color: var(--colorway-hover);
}

/* Solid Active */
.breeze-button--solid.breeze-button--active,
.breeze-button--ghost-solid.breeze-button--active,
.breeze-button--flat-solid.breeze-button--active {
    background-color: var(--foreground-active);
    border-color: var(--foreground-active);
}
.breeze-button--solid.breeze-button--colorway.breeze-button--active,
.breeze-button--ghost-solid.breeze-button--colorway.breeze-button--active,
.breeze-button--flat-solid.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-active);
    border-color: var(--colorway-active);
}

/* Solid Disabled */
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

.breeze-button--ghost,
.breeze-button--ghost-solid,
.breeze-button--ghost-flat {
    background-color: transparent;
    color: var(--text-foreground);
    border: var(--border-width) solid var(--foreground);
    transition: color 0.1s ease, background-color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--ghost.breeze-button--colorway,
.breeze-button--ghost-solid.breeze-button--colorway,
.breeze-button--ghost-flat.breeze-button--colorway {
    background-color: var(--colorway-contrast);
    border-color: var(--colorway);
    color: var(--colorway-text);
}

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
.breeze-button--ghost.breeze-button--colorway:hover,
.breeze-button--solid-ghost.breeze-button--colorway:hover,
.breeze-button--flat-ghost.breeze-button--colorway:hover,
.breeze-button--ghost.breeze-button--colorway:focus-visible,
.breeze-button--solid-ghost.breeze-button--colorway:focus-visible,
.breeze-button--flat-ghost.breeze-button--colorway:focus-visible {
    background-color: var(--colorway-contrast-hover);
    color: var(--colorway);
    border-color: var(--colorway);
}

.breeze-button--ghost.breeze-button--active,
.breeze-button--solid-ghost.breeze-button--active,
.breeze-button--flat-ghost.breeze-button--active {
    background-color: var(--background-active);
}
.breeze-button--ghost.breeze-button--colorway.breeze-button--active,
.breeze-button--solid-ghost.breeze-button--colorway.breeze-button--active,
.breeze-button--flat-ghost.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast-active);
}

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


.breeze-button--flat,
.breeze-button--flat-static,
.breeze-button--flat-solid,
.breeze-button--flat-ghost {
    color: var(--text-foreground);
    border: var(--border-width) solid transparent;
    background-color: transparent;
    transition: color 0.1s ease, background-color 0.1s ease, border-color 0.1s ease;
}
.breeze-button--flat.breeze-button--colorway,
.breeze-button--flat-solid.breeze-button--colorway,
.breeze-button--flat-ghost.breeze-button--colorway {
    color: var(--colorway);
}

.breeze-button--flat-static .button-content {
    border-bottom: 1px solid var(--foreground);
}

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
.breeze-button--flat.breeze-button--colorway:hover,
.breeze-button--solid-flat.breeze-button--colorway:hover,
.breeze-button--ghost-flat.breeze-button--colorway:hover,
.breeze-button--flat.breeze-button--colorway:focus-visible,
.breeze-button--solid-flat.breeze-button--colorway:focus-visible,
.breeze-button--ghost-flat.breeze-button--colorway:focus-visible {
    color: var(--colorway);
    background-color: var(--colorway-contrast);
    border-color: transparent;
}

.breeze-button--flat:hover .button-content,
.breeze-button--solid-flat:hover .button-content,
.breeze-button--ghost-flat:hover .button-content,
.breeze-button--flat:focus-visible .button-content,
.breeze-button--solid-flat:focus-visible .button-content,
.breeze-button--ghost-flat:focus-visible .button-content {
    border-color: var(--foreground);
}

.breeze-button--flat.breeze-button--active,
.breeze-button--solid-flat.breeze-button--active,
.breeze-button--ghost-flat.breeze-button--active {
    background-color: var(--background-active);
    border-color: var(--background-active);
}
.breeze-button--flat.breeze-button--colorway.breeze-button--active,
.breeze-button--solid-flat.breeze-button--colorway.breeze-button--active,
.breeze-button--ghost-flat.breeze-button--colorway.breeze-button--active {
    background-color: var(--colorway-contrast-hover);
}

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

.breeze-button--flat-static.breeze-button--disabled .button-content {
    border-color: var(--disabled-foreground-text);
}
</style>