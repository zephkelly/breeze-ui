export const ToggleButtonVariants = ['solid'] as const;

export type ToggleButtonVariant = typeof ToggleButtonVariants[number];

export interface ToggleButtonProps {
    variant?: ToggleButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    unstyled?: boolean;
    ariaLabel?: string;
    round?: boolean;
    modelValue?: boolean;
}