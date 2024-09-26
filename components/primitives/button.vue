<template>
    <component
        v-if="!headless"
        :is="componentType"
        :to="to"
        :href="href"
        :class="buttonClasses"
        :style="[cursorStyle, getButtonColors]"
        v-bind="mergedAttrs"
        @mousedown="handleDown"
        @mouseup="handleUp"
        @mouseleave="handleLeave"
        @touchstart.prevent="handleTouchStart"
        @touchend.prevent="handleTouchEnd"
        @touchcancel.prevent="handleTouchCancel"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
    >
        <div class="button-content" v-if="!loading">
            <span v-if="$slots['leading']" class="content-left" aria-hidden="true"> 
                <slot name="leading"></slot>
            </span>
            <span class="content-main">
                <div class="button-icon" v-if="icon">
                    <slot name="default"></slot>
                </div>
                <div class="button-text" v-else>
                    <slot name="default"></slot>
                </div>
            </span>
            <span v-if="$slots['trailing']" class="content-right" aria-hidden="true">
                <slot name="trailing"></slot>
            </span>
        </div>
        <span v-else class="button-loader" aria-hidden="true">
            <slot name="loader">Loading...</slot>
        </span>
    </component>
    <slot v-else :attributes="a11yAttrs" name="default">
    </slot>
</template>

<script setup lang="ts">
import { type ButtonProps, ButtonVariants, ButtonSizes, ButtonWidths } from '../../types/button';
import { useDevelopmentWarning } from '../../composables/useDevelopmentWarning';
import { useButtonColor } from '../../composables/useButtonColor';
import { debounce } from '../../utils/debounce';

// Using provided property from breeze module's 'colorScheme' plugin
const { $currentColorScheme } = useNuxtApp();

const isActive = ref(false);
const isActiveTimeout = ref<number | null>(null);
const touchStartTime = ref<number>(0);

const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'medium',
    variant: 'solid',
    holdable: false,
    color: undefined,
    disabled: false,
    loading: false,
    bounce: false,
    rounded: false,
    round: false,
    sharp: false,
    icon: false,
    width: 'auto',
    unstyled: false,
    ariaLabel: undefined,
    to: undefined,
    href: undefined,
});

// Computed class list for the button
const buttonClasses = computed(() => [
    { 'breeze-button': !props.unstyled },
    { [`breeze-button--${props.variant}`]: !props.unstyled },
    { 'breeze-button--full': !props.unstyled && props.width === 'full' },
    { 'breeze-button--colorway': !props.unstyled && props.color },
    { [`breeze-button--colorway-${props.color}`]: !props.unstyled && props.color },
    { 'breeze-button--loading': props.loading },
    { 'breeze-button--disabled': props.disabled || props.loading },
    { 'breeze-button--active': !props.unstyled && isActive.value },
    { 'breeze-button--holdable': props.holdable },
    { 'breeze-button--bounce': !props.unstyled && props.bounce },
    { 'breeze-button--rounded': !props.unstyled && props.rounded },
    { 'breeze-button--round': !props.unstyled && props.round },
    { 'breeze-button--sharp': !props.unstyled && props.sharp },
    { 'breeze-button--icon-only': !props.unstyled && props.icon },
    { [`breeze-button--size-${props.size}`]: !props.unstyled && props.size }
])

// Computed properties for button state
const isDisabled = computed(() => props.disabled || props.loading);
const cursorStyle = computed(() => ({ cursor: isDisabled.value ? 'not-allowed' : undefined }))

// Compute aria-label based on props and state
const ariaLabel = computed(() => {
    if (props.ariaLabel) {
        return props.ariaLabel;
    }
    
    return props.loading ? 'Loading' : undefined;
});

// Determine the component type based on props
const componentType = computed(() => {
    if (props.to) return resolveComponent('NuxtLink');
    if (props.href) return 'a';
    return 'button';
});



// Attributes
const attrs = useAttrs()

// Accessibility attributes for a headless button
const a11yAttrs = computed(() => ({
    role: 'button',
    tabindex: isDisabled.value ? -1 : 0,
    disabled: isDisabled.value,
    active: isActive.value,
    loading: props.loading,
    'aria-disabled': isDisabled.value,
    'aria-busy': props.loading,
    'aria-label': ariaLabel.value,
    'aria-pressed': props.holdable ? isActive.value : undefined,
    onMousedown: handleDown,
    onMouseup: handleUp,
    onMouseleave: handleLeave,
    onTouchstart: handleTouchStart,
    onTouchend: handleTouchEnd,
    onTouchcancel: handleTouchCancel,
    onKeydown: handleKeyDown,
    onKeyup: handleKeyUp,
}));

// All attributes for a non-headless button
const mergedAttrs = computed(() => ({
    ...attrs,
    ...a11yAttrs.value,
    disabled: isDisabled.value,
    active: isActive.value,
    loading: props.loading,
    'aria-disabled': isDisabled.value,
    'aria-busy': props.loading,
    'aria-label': ariaLabel.value,
}))


// Define emitted events
const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
    (e: 'pressstart'): void
    (e: 'pressend'): void
}>();

// Debounced click handler to prevent rapid successive clicks
const click = debounce((event: MouseEvent) => {
    emit('click', event);
}, 100);

// Set button to active state briefly on click
function setActiveFlash() {
    isActive.value = true;
    isActiveTimeout.value = window.setTimeout(() => {
        isActive.value = false;
    }, 150);
}

// Mouse event handlers
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

const handleUp = (event: MouseEvent) => {
    if (props.disabled || props.loading) return;
    
    if (props.holdable) {
        isActive.value = false;
        
        click(event as MouseEvent);
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

// Keyboard event handling
const isKeyDownEnterOrSpace = ref(false);
const handleKeyDown = (event: KeyboardEvent) => {
    if (props.disabled || props.loading) return;

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (!props.holdable && !isKeyDownEnterOrSpace.value) {   
            setActiveFlash();
            click(event as unknown as MouseEvent);
        }

        if (isKeyDownEnterOrSpace.value === false) {
            isActive.value = true;
        }
        
        isKeyDownEnterOrSpace.value = true;
        

        emit('pressstart');
    }
};

const handleKeyUp = (event: KeyboardEvent) => {
    if (props.disabled || props.loading) return;

    if (event.key === 'Enter' || event.key === ' ') {
        isKeyDownEnterOrSpace.value = false;
        
        if (props.holdable) {
            isActive.value = false;
            
            click(event as unknown as MouseEvent);
            emit('pressend');
        }
        
        if (!props.holdable) {
            isActive.value = false;
        }
    }
};

// Touch event handlers
const handleTouchStart = (event: TouchEvent) => {
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



// Color handling
const { getButtonColors, setButtonColor } = useButtonColor();

// Watch for color changes and update button color
watch(() => props.color, (newColor) => {
    if (newColor) {
        setButtonColor(props.color);
    }
}, { immediate: true })

// Watch for color scheme changes and update button color: >>> LEGACY will remove in future
watch($currentColorScheme, () => {
    setButtonColor(props.color);
}, { immediate: true })



// If 'devWarning: true' in the breeze module, show warnings for invalid props
const { devWarning } = useDevelopmentWarning();

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

        if (props.size) {
            devWarning(`The 'size' prop is not supported when 'headless' is true.`);
        }

        if (props.width) {
            devWarning(`The 'width' prop is not supported when 'headless' is true.`);
        }

        if (props.rounded) {
            devWarning(`The 'rounded' prop is not supported when 'headless' is true.`);
        }

        if (props.round) {
            devWarning(`The 'round' prop is not supported when 'headless' is true.`);
        }

        if (props.sharp) {
            devWarning(`The 'sharp' prop is not supported when 'headless' is true.`);
        }
    }

    if (props.sharp && props.rounded) {
        devWarning(`Conflicting prop types: 'sharp' and 'rounded'. Defaulting to 'sharp'.`);
    }

    if (props.color as string === '') {
        devWarning(`Empty button color. Defaulting to no color.`);
        devWarning(`Valid button colors are: ${Object.values(ButtonColors).join(', ')}`);
    }

    if (props.size as string === '') {
        devWarning(`Empty button size. Defaulting to '${ButtonSizes[0]}'`);
        devWarning(`Valid button sizes are: ${Object.values(ButtonSizes).join(', ')}`);
    }

    if (props.width as string === '') {
        devWarning(`Empty button width. Defaulting to '${ButtonWidths[0]}'`);
        devWarning(`Valid button widths are: ${Object.values(ButtonWidths).join(', ')}`);
    }

    if (props.variant as string === '') {
        devWarning(`Empty button variant. Defaulting to '${ButtonVariants[0]}'`);
        devWarning(`Valid button variants are: ${Object.values(ButtonVariants).join(', ')}`);
    }
}
</script>

<!-- Default Button Styles -->
<style scoped>
.breeze-button {
    padding: var(--padding-6) var(--padding-12);
    border: none;
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

.breeze-button--size-tiny {
    height: 26px;
    max-height: 26px;
    font-size: var(--font-size-tiny);
    padding: var(--padding-5) var(--padding-8);
}
.breeze-button--size-small {
    height: 28px;
    max-height: 28px;
    font-size: var(--font-size-small);
    padding: var(--padding-5) var(--padding-12);
}
.breeze-button--size-medium {
    height: 32px;
    max-height: 32px;
    font-size: var(--font-size-medium);
    padding: var(--padding-5) var(--padding-12);
}
.breeze-button--size-large {
    height: 36px;
    max-height: 36px;
    font-size: var(--font-size-large);
    padding: var(--padding-6) var(--padding-12);
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

<!-- Stylings for other button variants -->
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
.breeze-button--solid.breeze-button--colorway,
.breeze-button--solid-ghost.breeze-button--colorway,
.breeze-button--solid-flat.breeze-button--colorway {
    background-color: var(--color-500);
    border-color: var(--color-500);
    color: var(--text-background);
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
.breeze-button--solid.breeze-button--colorway:hover,
.breeze-button--ghost-solid.breeze-button--colorway:hover,
.breeze-button--flat-solid.breeze-button--colorway:hover,
.breeze-button--solid.breeze-button--colorway:focus-visible,
.breeze-button--ghost-solid.breeze-button--colorway:focus-visible,
.breeze-button--flat-solid.breeze-button--colorway:focus-visible {
    background-color: var(--color-400);
    border-color: var(--color-400);
    color: var(--text-background);
}

/* Active State */
.breeze-button--solid.breeze-button--active,
.breeze-button--ghost-solid.breeze-button--active,
.breeze-button--flat-solid.breeze-button--active {
    background-color: var(--foreground-active);
    border-color: var(--foreground-active);
}
.breeze-button--solid.breeze-button--colorway.breeze-button--active,
.breeze-button--ghost-solid.breeze-button--colorway.breeze-button--active,
.breeze-button--flat-solid.breeze-button--colorway.breeze-button--active {
    background-color: var(--color-500);
    border-color: var(--color-500);
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
.breeze-button--ghost.breeze-button--colorway,
.breeze-button--ghost-solid.breeze-button--colorway,
.breeze-button--ghost-flat.breeze-button--colorway {
    background-color: var(--color-100);
    border-color: var(--color-500);
    color: var(--color-500);
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
.breeze-button--ghost.breeze-button--colorway:hover,
.breeze-button--solid-ghost.breeze-button--colorway:hover,
.breeze-button--flat-ghost.breeze-button--colorway:hover,
.breeze-button--ghost.breeze-button--colorway:focus-visible,
.breeze-button--solid-ghost.breeze-button--colorway:focus-visible,
.breeze-button--flat-ghost.breeze-button--colorway:focus-visible {
    background-color: var(--color-200);
    color: var(--color-500);
    border-color: var(--color-500);
}

/* Active State */
.breeze-button--ghost.breeze-button--active,
.breeze-button--solid-ghost.breeze-button--active,
.breeze-button--flat-ghost.breeze-button--active {
    background-color: var(--background-active);
}
.breeze-button--ghost.breeze-button--colorway.breeze-button--active,
.breeze-button--solid-ghost.breeze-button--colorway.breeze-button--active,
.breeze-button--flat-ghost.breeze-button--colorway.breeze-button--active {
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
.breeze-button--flat.breeze-button--colorway,
.breeze-button--flat-solid.breeze-button--colorway,
.breeze-button--flat-ghost.breeze-button--colorway,
.breeze-button--flat-static.breeze-button--colorway {
    color: var(--color-500);
}
.breeze-button--flat-static .button-content {
    border-color: var(--color-500);
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
.breeze-button--flat.breeze-button--colorway:hover,
.breeze-button--solid-flat.breeze-button--colorway:hover,
.breeze-button--ghost-flat.breeze-button--colorway:hover,
.breeze-button--flat.breeze-button--colorway:focus-visible,
.breeze-button--solid-flat.breeze-button--colorway:focus-visible,
.breeze-button--ghost-flat.breeze-button--colorway:focus-visible {
    color: var(--color-500);
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
.breeze-button--flat.breeze-button--colorway.breeze-button--active,
.breeze-button--solid-flat.breeze-button--colorway.breeze-button--active,
.breeze-button--ghost-flat.breeze-button--colorway.breeze-button--active {
    background-color: var(--color-300);
    border-color: var(--color-300);
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
</style>