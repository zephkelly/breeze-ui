<template>
    <div
        role="group"
        aria-label="Button Group"
        class="breeze-button-group"
        :style="{ '--total-buttons': processedButtons.length }"
    >
        <template v-for="(button, index) in processedButtons" :key="index">
            <div v-if="button.isSeparate" class="breeze-button-group-wrapper">
                <component
                :is="button.component"
                v-bind="button.isHeadless ? {} : getExtraProps(button, index)"
                />
            </div>
            <component
                v-else
                :is="button.component"
                v-bind="button.isHeadless ? {} : getExtraProps(button, index)"
            />
        </template>
    </div>
</template>
  
<script setup lang="ts">
import { useSlots, computed, type VNodeArrayChildren } from 'vue';

const slots = useSlots();
const defaultSlotContent = computed(() => slots.default?.() || []);

const processedButtons = computed(() => {
    return defaultSlotContent.value.map((button, index, array) => {
        const colorwayClass = button.props?.class?.match(/breeze-button--colorway-\w+/)?.[0];
        const nextButton = array[index + 1];
        const nextColorwayClass = nextButton?.props?.class?.match(/breeze-button--colorway-\w+/)?.[0];
       
        let isHeadless = false;
       
        if (button.props?.headless === undefined) {
            isHeadless = false;
        } else if (button.props?.headless === '') {
            isHeadless = true;
        } else {
            isHeadless = button.props?.headless;
        }

        const isSeparate = button.type === 'template' && button.props?.separate !== undefined;

        console.log(isSeparate);
        
        //@ts-expect-error
        const actualComponent = isSeparate && button.children && button.children.length > 0
            //@ts-expect-error
            ? button.children[0]
            : button;
         
        return {
            component: actualComponent,
            props: actualComponent.props || {},
            sameColorway: colorwayClass && colorwayClass === nextColorwayClass,
            isHeadless,
            isSeparate
        };
    });
});

const getExtraProps = (button: any, index: number) => ({
    'data-index': index,
    'data-total': processedButtons.value.length,
    'data-same-colorway': button.sameColorway,
    'data-separate': button.isSeparate,
    style: { '--button-index': index }
});
</script>
  

<style scoped>
.breeze-button-group {
    display: inline-flex;
    padding: 0;
    margin: 0;
    --total-buttons: 1;
}
.breeze-button-group :deep(.breeze-button) {
    position: relative;
    z-index: calc(var(--total-buttons) - var(--button-index, 0));
}
.breeze-button-group :deep(.breeze-button.breeze-button--ghost) {
    margin-right: calc(var(--button-border-width) * -1);
}
.breeze-button-group :deep(.breeze-button[class="breeze-button--colorway"]) {
    margin-right: 0;
}
.breeze-button-group :deep(.breeze-button:not(:first-child):not(:last-child)) {
    border-radius: 0;
}
.breeze-button-group :deep(.breeze-button:first-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.breeze-button-group :deep(.breeze-button:last-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.breeze-button-group :deep(.breeze-button:only-child) {
    border-radius: var(--border-radius-6);
}
.breeze-button-group :deep(.breeze-button:focus-visible) {
    z-index: calc(var(--total-buttons) + 1);
}

.breeze-button-group-wrapper {
  margin: 0 1rem;
}

.breeze-button-group-wrapper:first-child {
  margin-left: 0;
}

.breeze-button-separate-wrapper:last-child {
  margin-right: 0;
}

.breeze-button-group :deep(.breeze-button-group-wrapper + .breeze-button:not([data-separate="true"])) {
  border-top-left-radius: var(--border-radius-6);
  border-bottom-left-radius: var(--border-radius-6);
}

.breeze-button-group :deep(.breeze-button-group-wrapper .breeze-button:first-of-type) {
    border-top-left-radius: var(--border-radius-6);
    border-bottom-left-radius: var(--border-radius-6);
}


.breeze-button-group :deep(.breeze-button-group-wrapper .breeze-button:last-of-type) {
    border-top-right-radius: var(--border-radius-6);
    border-bottom-right-radius: var(--border-radius-6);
}

.breeze-button-group :deep(.breeze-button:not([data-separate="true"]):has(+.breeze-button-group-wrapper)) {
    border-top-right-radius: var(--border-radius-6);
    border-bottom-right-radius: var(--border-radius-6);
}
</style>