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
import { useButtonColors } from './../../../composables/useButtonColor';
import { type ButtonProps, type ButtonVariant, type ButtonSize, type ButtonShape, type ButtonColor } from './../../../types/button';

const props = withDefaults(defineProps<ButtonProps>(), {
    variant: 'solid' as ButtonVariant,
    color: 'primary' as ButtonColor,
    holdable: false,
    debounce: true,
    size: 'small',
})

const buttonClasses = computed(() => [
    { 'breeze-button': !props.unstyled },
    { [`breeze-button--${props.variant}`]: !props.unstyled && props.variant },
    { 'breeze-button--bounce': !props.unstyled && props.bounce },
//     { 'breeze-button--full': !props.unstyled && props.width === 'full' },
    // { 'breeze-button--color': !props.unstyled && props.color },
//     { [`breeze-button--color-${props.color}`]: !props.unstyled && props.color},
//     { 'breeze-button--holdable': props.holdable },
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

const { buttonColors } = useButtonColors(props);

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
    background-color: v-bind('buttonColors.background');
    color: v-bind('buttonColors.text');
    border: 1px solid v-bind('buttonColors.border');
}

.breeze-button:hover,
.breeze-button:focus-visible {
    background-color: v-bind('buttonColors.hover');
    color: v-bind('buttonColors.text');
}

.breeze-button.breeze-button--active {
    background-color: v-bind('buttonColors.active');
    color: v-bind('buttonColors.text');
}

.breeze-button:focus-visible {
    outline: 2px solid var(--foreground);
    box-shadow: 0 0 0 5px var(--background);    
}

.breeze-button--flat-static .button-content {
    border-bottom: 1px solid v-bind('buttonColors.contentBorder');
}

.breeze-button--bounce.breeze-button--active {
    transform: translateY(1px);
}
</style>