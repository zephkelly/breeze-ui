export const ButtonVariants = [
    'solid', 'solid-ghost', 'solid-flat',
    'flat',
    'ghost', 'ghost-solid', 'ghost-flat'
] as const;

export type ButtonVariant = typeof ButtonVariants[number];

export interface ButtonProps {
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    unstyled?: boolean;
    ariaLabel?: string;
    href?: string;
    to?: string;
    holdable?: boolean;
    bounce?: boolean;
}