export const ButtonVariants = [
    'solid', 'solid-ghost', 'solid-flat',
    'flat', 'flat-ghost', 'flat-static',
    'ghost', 'ghost-solid', 'ghost-flat'
] as const;

export const ButtonColors = [
    'foreground', 'background',
    'danger', 'warning', 'success',
] as const;


export type ButtonVariant = typeof ButtonVariants[number];
export type ButtonColor = typeof ButtonColors[number];

export interface ButtonProps {
    variant?: ButtonVariant;
    colorway?: ButtonColor;
    disabled?: boolean;
    loading?: boolean;
    unstyled?: boolean;
    ariaLabel?: string;
    href?: string;
    to?: string;
    holdable?: boolean;
    bounce?: boolean;
}