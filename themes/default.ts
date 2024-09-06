import { type Theme} from '~/types/theme'

export const defaultTheme: Theme = {
    light: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#ffffff',
        text: '#333333',
    },
    dark: {
        primary: '#0056b3',
        secondary: '#495057',
        background: '#121212',
        text: '#e0e0e0',
    },
    fonts: {
        primary: 'Arial, sans-serif',
        secondary: 'Georgia, serif',
    },
    fontWeights: {
        normal: 400,
        bold: 700,
    },
}