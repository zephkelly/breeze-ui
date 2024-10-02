import { computed } from 'vue';
import type { ButtonProps, ButtonVariant, ButtonColor } from './../types/button';

export const useButtonColors = (props: ButtonProps) => {
    const getColorVar = (color: ButtonColor, shade: number) => `var(--${color}-${shade})`;

    const getVariantColors = (color: ButtonColor, variant: ButtonVariant) => {
        const baseColors = {
            background: getColorVar(color, 900),
            text: 'var(--text-background)',
            hover: getColorVar(color, 800),
            active: getColorVar(color, 900),
            border: getColorVar(color, 900),
            contentBorder: 'transparent',
        };

        const ghostColors = {
            background: 'transparent',
            text: 'var(--text-foreground)',
            hover: 'var(--background-hover)',
            active: 'var(--background-active)',
            border: 'var(--foreground)',
            contentBorder: 'transparent',
        };

        const flatColors = {
            background: 'transparent',
            text: 'var(--text-foreground)',
            hover: 'var(--background-hover)',
            active: 'var(--background-active)',
            border: 'transparent',
            contentBorder: 'var(--foreground)',
        };

        const variantColorMap: Record<ButtonVariant, typeof baseColors> = {
            'solid': baseColors,
            'ghost': ghostColors,
            'flat': flatColors,
            'solid-ghost': {
                ...baseColors,
                background: 'transparent',
                text: 'var(--text-foreground)',
                hover: 'var(--foreground-hover)',
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
                text: 'var(--text-foreground)',
            },
            'flat-static': {
                ...flatColors,
                hover: 'transparent',
                active: 'transparent',
                contentBorder: 'var(--text-foreground)',
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
            variantColorMap['ghost'].background = getColorVar(color, 100);
            variantColorMap['ghost'].text = getColorVar(color, 900);
            variantColorMap['ghost'].hover = getColorVar(color, 200);
            variantColorMap['ghost'].active = getColorVar(color, 300);
            variantColorMap['ghost'].border = getColorVar(color, 900);

            variantColorMap['flat'].text = getColorVar(color, 900);
            variantColorMap['flat'].hover = getColorVar(color, 100);
            variantColorMap['flat'].active = getColorVar(color, 200);

            variantColorMap['flat-static'].text = getColorVar(color, 900);
            variantColorMap['flat-static'].contentBorder = getColorVar(color, 900);
        }

        return variantColorMap[variant];
    };

    const buttonColors = computed(() => {
        const color = props.color || 'primary';
        const variant = props.variant || 'solid';
        return getVariantColors(color as ButtonColor, variant as ButtonVariant);
    });

    return {
        buttonColors
    };
};