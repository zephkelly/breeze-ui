import { type ButtonProps } from './button';

export type ToggleDefaultState = 'on' | 'off';

export interface ToggleButtonProps extends ButtonProps {
    modelValue?: boolean;
    defaultState?: ToggleDefaultState;
    onLabel?: string;
    offLabel?: string;
}
