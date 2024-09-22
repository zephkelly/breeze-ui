export type ColorScheme = 'light' | 'dark';

export interface ColorSchemeNuxtAppContext {
    $isSystemColorScheme: Ref<boolean>;
    $currentScheme: ComputedRef<ColorScheme>;
    $toggleColorScheme: () => void;
    $resetToSystem: () => void;
    $systemPreference: Ref<'light' | 'dark'>;
}