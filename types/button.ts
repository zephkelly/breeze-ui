export const ButtonVariants = [
    'solid', 'flat', 'ghost',
] as const;

export const ButtonColors = [
    'primary', 'secondary', 'red', 'green', 'blue'
] as const;

export const ButtonWidths = [
    'auto', 'full'
] as const;

export const ButtonSizes = [
    'tiny', 'small', 'medium', 'large'
] as const;

export const ButtonShapes = [
    'rounded', 'round', 'sharp', 'default'
] as const;

export type ButtonVariant = typeof ButtonVariants[number];
export type ButtonColor = typeof ButtonColors[number];
export type ButtonWidth = typeof ButtonWidths[number];
export type ButtonSize = typeof ButtonSizes[number];
export type ButtonShape = typeof ButtonShapes[number];

export interface ButtonBaseProps {
    disabled?: boolean;
    loading?: boolean;
    ariaLabel?: string;
    href?: string;
    to?: string;
    holdable?: boolean;
    headless?: boolean;
    debounce?: boolean;
}

export interface ButtonProps extends ButtonBaseProps {
    variant?: ButtonVariant,
    color?: ButtonColor,
    width?: ButtonWidth,
    shape?: ButtonShape,
    size?: ButtonSize,
    compact?: boolean,
    unstyled?: boolean,
    bounce?: boolean,
    icon?: boolean,
    inverted?: boolean,
}