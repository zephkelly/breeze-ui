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
        <slot name="prebuilt" :a11yAttrs="a11yAttrs">
            <div class="button-content" v-if="!loading">
                <span v-if="$slots['leading']" class="breeze-button-icon left" aria-hidden="true"> 
                    <slot name="leading"></slot>
                </span>
                <span class="content-main">
                    <div class="button-text" v-if="!isSvgContent">
                        <slot name="default"></slot>
                    </div>
                    <div class="button-icon" v-else>
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
import { type ButtonProps, ButtonVariants, ButtonSizes, ButtonWidths } from './../../types/button';

const props = withDefaults(defineProps<ButtonProps>(), {
    size: 'medium',
});