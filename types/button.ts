export const ButtonVariants = ['solid', 'outline', 'ghost'] as const;

export type ButtonVariant = typeof ButtonVariants[number];

export interface ButtonProps {
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    unstyled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    ariaLabel?: string;
}