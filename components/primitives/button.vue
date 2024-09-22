<template>
    <component
        
</template>

<script setup lang="ts">
//@ts-ignore
import { NuxtLink } from '#components'
import { type ButtonProps, ButtonVariants, ButtonSizes, ButtonWidths } from './../../types/button';
import { debounce } from './../../utils/debounce';

import { useButtonColor } from './../../composables/useButtonColor';
import { useDevelopmentWarning } from './../../composables/useDevelopmentWarning';

const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'medium',
});

const buttonRef = ref<HTMLElement | null>(null);
const colorwayRef = ref(props.colorway)
const isSvgContent = ref(false);

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
    { 'breeze-button--full': !props.unstyled && validatedWidth.value === 'full' },
    { 'breeze-button--colorway': !props.unstyled && props.colorway },
    { 'breeze-button--loading': props.loading },
    { 'breeze-button--disabled': props.disabled },
    { 'breeze-button--active': !props.unstyled && isActive.value },
    { 'breeze-button--holdable': props.holdable },
    { 'breeze-button--bounce': !props.unstyled && props.bounce },
    { 'breeze-button--rounded': !props.unstyled && props.rounded },
    { 'breeze-button--round': !props.unstyled && props.round },
    { 'breeze-button--sharp': !props.unstyled && props.sharp },
    { 'breeze-button--icon-only': isSvgContent },
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

onMounted(async () => {
    await nextTick();
    if (buttonRef.value) {
        const slotContent = buttonRef.value.querySelector('.content-main > div > *') as Element | null;
        isSvgContent.value = slotContent ? slotContent.tagName.toLowerCase() === 'svg' : false;
    }
});

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

    if (props.sharp && props.rounded) {
        devWarning(`Conflicting prop types: 'sharp' and 'rounded'. Defaulting to 'sharp'.`);
    }
}
</script>

<!-- Default Styles -->
<style scoped>
.breeze-button {
    padding: var(--padding-4) var(--padding-12);
    border: none;
    border-radius: var(--border-radius-6);
    font-weight: 500;
    font-size: var(--font-size-small);
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
}

.breeze-button--sharp {
    border-radius: 0;
}

.breeze-button--icon-only,
.breeze-button--round {
    aspect-ratio: 1;
    padding: var(--padding-6);
}

.breeze-button--size-tiny {
    height: 24px;
    max-height: 24px;
}
.breeze-button--size-tiny.breeze-button--icon-only {
    padding: var(--padding-2);
}

.breeze-button--size-small {
    height: 32px;
    max-height: 32px;
}
.breeze-button--size-small.breeze-button--icon-only {
    padding: var(--padding-4);
}

.breeze-button--size-medium {
    height: 40px;
    max-height: 40px;
}
.breeze-button--size-medium.breeze-button--icon-only {
    padding: var(--padding-6);
}

.breeze-button--size-large {
    height: 48px;
    max-height: 48px;
}
.breeze-button--size-large.breeze-button--icon-only {
    padding: var(--padding-8);
}

.button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: 100%;
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

.button-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    width: 100%;
}

.button-text {
    display: inline-flex;
    align-items: center;
    height: 100%;
}

.breeze-button-icon {
    display: inline-flex;
    align-items: center;
    height: 100%;
}
</style>
