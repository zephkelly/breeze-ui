export interface Colors {
    foreground?: string;
    background?: string;
    text?: string;
    hover?: string;
    border?: string;
    active?: string;
}

export interface Theme {
    light: Colors;
    dark: Colors;
    fonts: {
        primary: string;
        secondary: string;
    };
    fontWeights: {
        normal: number;
        bold: number;
    };
}