import { type ColorScheme } from './../types/colorScheme';

export const useColorScheme = () => {
    const colorScheme = ref<ColorScheme | null>(null)
    const isSystemColorScheme = computed(() => colorScheme.value === null)
    const systemPreference = ref<'light' | 'dark'>('light')
    
    const currentScheme = computed(() => {
        if (isSystemColorScheme.value) {
            return systemPreference.value
        }
        return colorScheme.value
    })

    const getSystemPreference = (): 'light' | 'dark' => {
        if (import.meta.client && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    }

    const updateSystemPreference = () => {
        systemPreference.value = getSystemPreference()
    }

    const setColorScheme = (scheme: ColorScheme | null) => {
        colorScheme.value = scheme
        if (scheme === null) {
            updateSystemPreference()
        }
    }

    const toggleColorScheme = () => {
        if (colorScheme.value === null) {
            setColorScheme(systemPreference.value === 'light' ? 'dark' : 'light')
        } else {
            setColorScheme(colorScheme.value === 'light' ? 'dark' : 'light')
        }
    }

    const resetToSystem = () => {
        setColorScheme(null)
    }

    return {
        colorScheme,
        isSystemColorScheme,
        currentScheme,
        toggleColorScheme,
        resetToSystem,
        systemPreference,
        updateSystemPreference,
        setColorScheme
    }
}