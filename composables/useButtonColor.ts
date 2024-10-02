import { computed } from 'vue';
import type { ButtonProps, ButtonVariant, ButtonColor } from './../types/button';

export const useButtonColors = (props: ButtonProps) => {
    const getColorVar = (color: ButtonColor, shade: number, invert: boolean = false) => 
        `var(--${color}-${shade}${invert ? '-invert' : ''})`;

    const getVariantColors = (color: ButtonColor, variant: ButtonVariant, invert: boolean) => {
        const baseColors = {
            background: getColorVar(color, 900, invert),
            text: invert ? 'var(--text-foreground)' : 'var(--text-background)',
            hover: getColorVar(color, 800, invert),
            active: getColorVar(color, 900, invert),
            border: getColorVar(color, 900, invert),
            contentBorder: 'transparent',
        };

        const ghostColors = {
            background: 'transparent',
            text: invert ? 'var(--text-background)' : 'var(--text-foreground)',
            hover: invert ? getColorVar(color, 800, true) : 'var(--background-hover)',
            active: invert ? getColorVar(color, 900, true) : 'var(--background-active)',
            border: invert ? getColorVar(color, 100, true) : 'var(--foreground)',
            contentBorder: 'transparent',
        };

        const flatColors = {
            background: 'transparent',
            text: invert ? 'var(--text-background)' : 'var(--text-foreground)',
            hover: invert ? getColorVar(color, 800, true) : 'var(--background-hover)',
            active: invert ? getColorVar(color, 900, true) : 'var(--background-active)',
            border: 'transparent',
            contentBorder: invert ? getColorVar(color, 100, true) : 'var(--foreground)',
        };

        const variantColorMap: Record<ButtonVariant, typeof baseColors> = {
            'solid': baseColors,
            'ghost': ghostColors,
            'flat': flatColors,
            'solid-ghost': {
                ...baseColors,
                background: 'transparent',
                text: invert ? 'var(--text-background)' : 'var(--text-foreground)',
                hover: invert ? getColorVar(color, 800, true) : 'var(--foreground-hover)',
            },
            'solid-flat': {
                ...baseColors,
                background: 'transparent',
                border: 'transparent',
            },
            'flat-ghost': {
                ...ghostColors,
                border: 'transparent',
            },
            'flat-solid': {
                ...baseColors,
                background: 'transparent',
                text: invert ? 'var(--text-background)' : 'var(--text-foreground)',
            },
            'flat-static': {
                ...flatColors,
                hover: 'transparent',
                active: 'transparent',
                contentBorder: invert ? getColorVar(color, 100, true) : 'var(--text-foreground)',
            },
            'ghost-solid': {
                ...ghostColors,
                hover: baseColors.hover,
                active: baseColors.active,
            },
            'ghost-flat': {
                ...ghostColors,
                border: 'transparent',
            },
        };

        // Adjust colors for specific color prop
        if (color !== 'primary' && color !== 'secondary') {
            variantColorMap['ghost'].text = getColorVar(color, 900, invert);
            variantColorMap['ghost'].border = getColorVar(color, 900, invert);
            variantColorMap['ghost'].background = getColorVar(color, 100, invert);
            variantColorMap['ghost'].hover = getColorVar(color, 200, invert);
            variantColorMap['ghost'].active = getColorVar(color, 300, invert);
            variantColorMap['flat'].text = getColorVar(color, 900, invert);
            variantColorMap['flat'].hover = getColorVar(color, 100, invert);
            variantColorMap['flat'].active = getColorVar(color, 200, invert);
            variantColorMap['flat-static'].text = getColorVar(color, 900, invert);
            variantColorMap['flat-static'].contentBorder = getColorVar(color, 900, invert);
        }

        return variantColorMap[variant];
    };

    const buttonColors = computed(() => {
        const color = props.color || 'primary';
        const variant = props.variant || 'solid';
        const invert = props.inverted || false;
        return getVariantColors(color as ButtonColor, variant as ButtonVariant, invert);
    });

    return {
        buttonColors
    };
};