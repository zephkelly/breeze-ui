export type ColorScheme = 'light' | 'dark';

export interface ColorSchemeNuxtAppContext {
    $currentColorScheme: ComputedRef<ColorScheme>;
    $toggleUserColorScheme: () => void;
    $setSystemColorScheme: () => void;
}