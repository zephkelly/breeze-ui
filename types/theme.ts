export interface ColorScheme {
    primary: string;
    secondary: string;
    background: string;
    text: string;
}

export interface Theme {
    light: ColorScheme;
    dark: ColorScheme;
    fonts: {
        primary: string;
        secondary: string;
    };
    fontWeights: {
        normal: number;
        bold: number;
    };
}