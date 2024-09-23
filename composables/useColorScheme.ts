import { type ColorScheme } from '../types/colorScheme';

type ColorSchemeOrNull = ColorScheme | null;

const currentUserColorScheme = () => useState<ColorSchemeOrNull>('currentUserColorScheme', () => null)
const currentSystemColorScheme = () => useState<ColorSchemeOrNull>('currentSystemColorScheme', () => null)

export const useColorScheme = () => {
    const currentColorScheme: Ref<ColorScheme> = computed(() => currentUserColorScheme().value ?? currentSystemColorScheme().value ?? 'light')
    const isSystemColorScheme = computed(() => currentUserColorScheme().value === null || currentSystemColorScheme().value !== null)

    const updateSystemColorScheme = () => {
        currentSystemColorScheme().value = getSystemColorScheme()
    }

    const updateUserColorScheme = (scheme: ColorSchemeOrNull) => {
        currentUserColorScheme().value = scheme
    }

    const toggleUserColorScheme = () => {
        if (currentUserColorScheme().value === null) {
            if (currentSystemColorScheme().value === null) {
                updateUserColorScheme('dark')
            }
            else
            {
                updateUserColorScheme(currentSystemColorScheme().value === 'light' ? 'dark' : 'light')
            }
        }
        else {
            updateUserColorScheme(currentUserColorScheme().value === 'light' ? 'dark' : 'light')
        }
    }

    const applySystemColorScheme = () => {
        currentUserColorScheme().value = null
    }

    if (import.meta.client) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', () => {
            updateSystemColorScheme()
        })
    }

    return {
        currentColorScheme,
        currentUserColorScheme,
        currentSystemColorScheme,
        updateSystemColorScheme,
        updateUserColorScheme,
        toggleUserColorScheme,
        applySystemColorScheme
    }
}

function getSystemColorScheme() {
    if (import.meta.server) return null;
    if (!window.matchMedia) return null;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}