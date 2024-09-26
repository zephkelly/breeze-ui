<template>
    <Button
        :variant="variant"
        :color="color"
        :size="size"
        :width="width"
        :disabled="disabled"
        :loading="loading"
        :unstyled="unstyled"
        :aria-label="ariaLabel"
        :aria-pressed="isActive"
        :holdable="holdable"
        :bounce="bounce"
        :rounded="rounded"
        :round="round"
        :sharp="sharp"
        :icon="icon"
        :to="to"
        :href="href"
        @click="toggle"
        :class="['breeze-toggle-button', { 'breeze-toggle-button--active': isActive }]"
    >
        <template #leading v-if="$slots.leading">
            <slot name="leading" />
        </template>
        <template #default>
            <span v-if="$slots.default">
                <slot />
            </span>
            <template class="toggle-status-label" v-else>
                {{ isActive ? onLabel : offLabel }}
            </template >
        </template>
        <template #trailing v-if="$slots.trailing">
            <slot name="trailing" />
        </template>
    </Button>
  </template>
  
<script setup lang="ts">
import { type VNode } from 'vue';
import { type ToggleButtonProps, type ToggleDefaultState } from '../../types/toggleButton';
import Button from './button.vue';
  
const props = withDefaults(defineProps<ToggleButtonProps>(), {
    // Standard Button Props
    variant: 'solid',
    color: undefined,
    size: 'medium',
    width: 'auto',
    disabled: false,
    loading: false,
    unstyled: false,
    ariaLabel: undefined,
    holdable: false,
    bounce: false,
    rounded: false,
    round: false,
    sharp: false,
    icon: false,
    to: undefined,
    href: undefined,

    // Toggle Button Props
    modelValue: undefined,
    defaultState: 'off',
    onLabel: 'On',
    offLabel: 'Off',
});

const internalState = ref<boolean>(defaultStateToBoolean(props.defaultState));
  
const isActive = computed(() => {
    return props.modelValue !== undefined ? props.modelValue : internalState.value;
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'update', value: boolean): void;
}>();

const emitUpdate = (value: boolean) => {
    emit('update:modelValue', value);
    emit('update', value);
};

const toggle = () => {
    if (!props.disabled && !props.loading) {
        const newValue = !isActive.value;

        if (props.modelValue !== undefined) {
            emitUpdate(newValue);
        }
        else {
            internalState.value = !internalState.value;
            emitUpdate(newValue);
        }
    }
};

function defaultStateToBoolean(state: ToggleDefaultState): boolean {
    return state === 'on' ? true : false;
}

watch(() => props.modelValue, (newValue) => {
    if (newValue !== undefined) {
        internalState.value = newValue;
    }
});

onMounted(() => {
    if (props.modelValue === undefined && props.defaultState) {
        emitUpdate(defaultStateToBoolean(props.defaultState));
    }
});
</script>
  
<style scoped>
    .breeze-toggle-button {
        /* transition: all 0.2s ease-in-out; */
    }
    
    .breeze-toggle-button--active {
        /* You can add any additional styling for the active state here */
    }

.toggle-status-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>