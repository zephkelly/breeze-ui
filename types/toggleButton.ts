import { type ButtonProps } from './button';

export type ToggleDefaultState = 'on' | 'off';

interface TemplateProps {
    separate?: boolean;
}

export interface ToggleButtonProps extends ButtonProps {
    modelValue?: boolean;
    defaultState?: ToggleDefaultState;
    onLabel?: string;
    offLabel?: string;
}

export type ButtonVNode = VNode<any, ButtonProps>;
export type TemplateVNode = VNode<any, TemplateProps>;