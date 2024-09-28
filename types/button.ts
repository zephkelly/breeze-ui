export const ButtonVariants = [
    'solid', 'solid-ghost', 'solid-flat',
    'flat', 'flat-ghost', 'flat-solid', 'flat-static',
    'ghost', 'ghost-solid', 'ghost-flat'
] as const;

export const ButtonColors = [
    'red', 'orange', 'green',
] as const;

export const ButtonWidths = [
    'auto', 'full'
] as const;

export const ButtonSizes = [
    'tiny', 'small', 'medium', 'large'
] as const;

export type ButtonVariant = typeof ButtonVariants[number];
export type ButtonColor = typeof ButtonColors[number];
export type ButtonWidth = typeof ButtonWidths[number];
export type ButtonSize = typeof ButtonSizes[number];

export interface ButtonProps {
    variant?: ButtonVariant;
    color?: ButtonColor;
    disabled?: boolean;
    loading?: boolean;
    unstyled?: boolean;
    ariaLabel?: string;
    href?: string;
    to?: string;
    width?: ButtonWidth,
    size?: ButtonSize,
    holdable?: boolean;
    headless?: boolean;
    bounce?: boolean;
    rounded?: boolean;
    round?: boolean;
    sharp?: boolean;
    icon?: boolean;
    debounce?: number;
}