import { computed } from 'vue';
import type { ButtonProps, ButtonVariant, ButtonColor } from './../types/button';

export const useButtonColors = (props: ButtonProps) => {
    const getColorVar = (color: ButtonColor, shade: number, invert: boolean = false) => 
        `var(--${color}-${shade}${invert ? '-invert' : ''})`;

    const getVariantColors = (color: ButtonColor, variant: ButtonVariant, invert: boolean) => {
        const baseColors = {
            background: invert ? 'var(--background)' : 'var(--foreground)',
            text: invert ? 'var(--text-foreground)' : 'var(--text-background)',
            hover: invert ? 'var(--background-hover)' : 'var(--foreground-hover)',
            active: invert ? 'var(--background-active)' : 'var(--foreground-active)',
            border: invert ? 'var(--background)' : 'var(--foreground)',
            borderHover: invert ? 'var(--background-hover)' : 'var(--foreground-hover)',
            borderActive: invert ? 'var(--background-active)' : 'var(--foreground-active)',
            contentBorder: 'transparent',
        };

        const ghostColors = {
            background: 'transparent',
            text: invert ? 'var(--text-background)' : 'var(--text-foreground)',
            hover: invert ? 'var(--foreground-hover' : 'var(--background-hover)',
            active: invert ? 'var(--foreground-active)' : 'var(--background-active)',
            border: invert ? 'var(--background)' : 'var(--foreground)',
            borderHover: invert ? 'var(--background)' : 'var(--foreground)',
            borderActive: invert ? 'var(--background)' : 'var(--foreground)',
            contentBorder: 'transparent',
        };

        const flatColors = {
            background: 'transparent',
            text: invert ? 'var(--text-background)' : 'var(--text-foreground)',
            hover: invert ? 'var(--foreground-hover)' : 'var(--background-hover)',
            active: invert ? 'var(--foreground-active)' : 'var(--background-active)',
            border: 'transparent',
            borderHover: invert ? 'var(--foreground-hover)' : 'var(--background-hover)',
            borderActive: invert ? 'var(--foreground-active)' : 'var(--background-active)',
            contentBorder: invert ? 'var(--background)' : 'var(--foreground)',
        };

        const variantColorMap: Record<ButtonVariant, typeof baseColors> = {
            'solid': baseColors,
            'ghost': ghostColors,
            'flat': flatColors
        };

        // Adjust colors for specific color prop
        if (color !== 'primary' && color !== 'secondary') {
            variantColorMap['solid'].text = 'var(--text-foreground-dark)';
            variantColorMap['solid'].border = getColorVar(color, 900, invert);
            variantColorMap['solid'].borderHover = getColorVar(color, 800, invert);
            variantColorMap['solid'].borderActive = getColorVar(color, 700, invert);
            variantColorMap['solid'].background = getColorVar(color, 900, invert);
            variantColorMap['solid'].hover = getColorVar(color, 800, invert);
            variantColorMap['solid'].active = getColorVar(color, 700, invert);

            variantColorMap['ghost'].text = getColorVar(color, 900, invert);
            variantColorMap['ghost'].border = getColorVar(color, 900, invert);
            variantColorMap['ghost'].borderHover = getColorVar(color, 900, invert);
            variantColorMap['ghost'].borderActive = getColorVar(color, 900, invert);
            variantColorMap['ghost'].background = getColorVar(color, 100, invert);
            variantColorMap['ghost'].hover = getColorVar(color, 200, invert);
            variantColorMap['ghost'].active = getColorVar(color, 300, invert);
            
            variantColorMap['flat'].text = getColorVar(color, 900, invert);
            variantColorMap['flat'].hover = getColorVar(color, 100, invert);
            variantColorMap['flat'].borderHover = getColorVar(color, 200, invert);
            variantColorMap['flat'].borderActive = getColorVar(color, 300, invert);
            variantColorMap['flat'].active = getColorVar(color, 200, invert);
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