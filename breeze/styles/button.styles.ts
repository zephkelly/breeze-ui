export type ColorScheme = 'light' | 'dark';
export type ButtonState = 'default' | 'hover' | 'active' | 'focused';
export type ButtonVariant = 'solid' | 'ghost' | 'flat';
export type ButtonColor = 'primary';

type ColorConfig = {
    [key in ColorScheme]: {
        [state in ButtonState]: string;
    };
};

type VariantConfig = {
    background: ColorConfig;
    text: ColorConfig;
    border: ColorConfig;
};

export type ButtonStyleConfig = {
    [variant in ButtonVariant]: VariantConfig;
};

export type ButtonThemeConfig = {
    [color in ButtonColor]: ButtonStyleConfig;
};

const defaultButtonTheme: ButtonThemeConfig = {
    primary: {
        solid: {
            background: {
                light: {
                    default: 'var(--primary-600)',
                    hover: 'var(--primary-700)',
                    active: 'var(--primary-800)',
                    focused: 'var(--primary-600)',
                },
                dark: {
                    default: 'var(--primary-500)',
                    hover: 'var(--primary-400)',
                    active: 'var(--primary-300)',
                    focused: 'var(--primary-500)',
                },
            },
            text: {
                light: {
                    default: 'var(--white)',
                    hover: 'var(--white)',
                    active: 'var(--white)',
                    focused: 'var(--white)',
                },
                dark: {
                    default: 'var(--gray-900)',
                    hover: 'var(--gray-900)',
                    active: 'var(--gray-900)',
                    focused: 'var(--gray-900)',
                },
            },
            border: {
                light: {
                    default: 'transparent',
                    hover: 'transparent',
                    active: 'transparent',
                    focused: 'var(--primary-300)',
                },
                dark: {
                    default: 'transparent',
                    hover: 'transparent',
                    active: 'transparent',
                    focused: 'var(--primary-700)',
                },
            },
        },
        ghost: {
            background: {
                light: {
                    default: 'var(--primary-600)',
                    hover: 'var(--primary-700)',
                    active: 'var(--primary-800)',
                    focused: 'var(--primary-600)',
                },
                dark: {
                    default: 'var(--primary-500)',
                    hover: 'var(--primary-400)',
                    active: 'var(--primary-300)',
                    focused: 'var(--primary-500)',
                },
            },
            text: {
                light: {
                    default: 'var(--white)',
                    hover: 'var(--white)',
                    active: 'var(--white)',
                    focused: 'var(--white)',
                },
                dark: {
                    default: 'var(--gray-900)',
                    hover: 'var(--gray-900)',
                    active: 'var(--gray-900)',
                    focused: 'var(--gray-900)',
                },
            },
            border: {
                light: {
                    default: 'transparent',
                    hover: 'transparent',
                    active: 'transparent',
                    focused: 'var(--primary-300)',
                },
                dark: {
                    default: 'transparent',
                    hover: 'transparent',
                    active: 'transparent',
                    focused: 'var(--primary-700)',
                },
            },
        },
        flat: {
            background: {
                light: {
                    default: 'var(--primary-600)',
                    hover: 'var(--primary-700)',
                    active: 'var(--primary-800)',
                    focused: 'var(--primary-600)',
                },
                dark: {
                    default: 'var(--primary-500)',
                    hover: 'var(--primary-400)',
                    active: 'var(--primary-300)',
                    focused: 'var(--primary-500)',
                },
            },
            text: {
                light: {
                    default: 'var(--white)',
                    hover: 'var(--white)',
                    active: 'var(--white)',
                    focused: 'var(--white)',
                },
                dark: {
                    default: 'var(--gray-900)',
                    hover: 'var(--gray-900)',
                    active: 'var(--gray-900)',
                    focused: 'var(--gray-900)',
                },
            },
            border: {
                light: {
                    default: 'transparent',
                    hover: 'transparent',
                    active: 'transparent',
                    focused: 'var(--primary-300)',
                },
                dark: {
                    default: 'transparent',
                    hover: 'transparent',
                    active: 'transparent',
                    focused: 'var(--primary-700)',
                },
            },
        },
    },
  // ... repeat for secondary, success, warning, danger, info
};

export default defaultButtonTheme;