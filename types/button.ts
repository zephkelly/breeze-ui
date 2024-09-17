export const ButtonVariants = ['solid', 'flat', 'ghost', 'ghost-solid', 'ghost-flat', 'toggle', 'toggle-round'] as const;

export type ButtonVariant = typeof ButtonVariants[number];

export interface ButtonProps {
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    unstyled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    ariaLabel?: string;
    href?: string;
    to?: string;
}