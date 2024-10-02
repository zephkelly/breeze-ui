<template>
    <component v-if="!headless"
        :is="componentType"
        :to="to"
        :href="href"
        v-bind="attributes"
        :class="[
            {'breeze-button--active': isActive},
            {'breeze-button--disabled': props.disabled},
            {'breeze-button--loading': props.loading}
        ]"
    >
        <slot />
    </component>
    <slot v-else :attributes="attributes" />
</template>

<script setup lang="ts">
import { debounce } from './../../../../utils/debounce';
import { type ButtonBaseProps } from './../../../../types/button';

const props = withDefaults(defineProps<ButtonBaseProps>(), {
    holdable: false,
    disabled: false,
    loading: false,
    debounce: true,
    width: 'auto',
})

const isDisabled = computed(() => props.disabled || props.loading);
const ariaLabel = computed(() => {
    if (props.ariaLabel) {
        return props.ariaLabel;
    }
    
    return props.loading ? 'Loading' : undefined;
});

const attrs = useAttrs();

const attributes = computed(() => ({
    role: 'button',
    tabindex: isDisabled.value ? -1 : 0,
    disabled: isDisabled.value,
    loading: props.loading,
    'aria-disabled': isDisabled.value,
    'aria-busy': props.loading,
    'aria-label': ariaLabel.value,
    ...attrs,
    onMousedown: handleDown,
    onMouseup: handleUp,
    onMouseleave: handleLeave,
    onTouchstart: handleTouchStart,
    onTouchend: handleTouchEnd,
    onTouchcancel: handleTouchCancel,
    onKeydown: handleKeyDown,
    onKeyup: handleKeyUp,
}));

const isActive = ref(false);
const isActiveTimeout = ref<number | null>(null);
const touchStartTime = ref<number>(0);

const componentType = computed(() => {
    if (props.to) return resolveComponent('NuxtLink');
    if (props.href) return 'a';
    return 'button';
});

// Define emitted events
const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
    (e: 'pressstart'): void
    (e: 'pressend'): void
}>();

// Optionally debounced click handler to prevent rapid successive clicks
const click = (event: MouseEvent) => {
    if (props.debounce) {
        (debounce(() => {
            emit('click', event);
        }, 100))();
    } else {
        emit('click', event);
    }
}

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

    event.preventDefault();
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
        click(event as unknown as MouseEvent);
    }

    isActive.value = false;
    emit('pressend');
};

const handleTouchCancel = () => {
    if (props.disabled || props.loading) return;
    
    isActive.value = false;

    if (props.holdable) {
        emit('pressend');
    }
};
</script>