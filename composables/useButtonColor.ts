import { type ColorSchemeNuxtAppContext, type ColorScheme } from './../types/colorScheme'

interface ColorwayVariables {
    [key: string]: string
}

export function useButtonColor() {
    const nuxtApp = useNuxtApp()
  
    const currentColor = ref<ColorScheme | null>(null)

    const colorProperties = computed(() => {
        return {
            '--color-100': `var(--${currentColor.value}-100)`,
            '--color-200': `var(--${currentColor.value}-200)`,
            '--color-300': `var(--${currentColor.value}-300)`,
            '--color-400': `var(--${currentColor.value}-400)`,
            '--color-500': `var(--${currentColor.value}-500)`,
            '--color-600': `var(--${currentColor.value}-600)`,
            '--color-700': `var(--${currentColor.value}-700)`,
            '--color-800': `var(--${currentColor.value}-800)`,
            '--color-900': `var(--${currentColor.value}-900)`,
            '--color-1000': `var(--${currentColor.value}-1000)`,
            '--color-100-invert': `var(--${currentColor.value}-100-invert)`,
            '--color-200-invert': `var(--${currentColor.value}-200-invert)`,
            '--color-300-invert': `var(--${currentColor.value}-300-invert)`,
            '--color-400-invert': `var(--${currentColor.value}-400-invert)`,
            '--color-500-invert': `var(--${currentColor.value}-500-invert)`,
            '--color-600-invert': `var(--${currentColor.value}-600-invert)`,
            '--color-700-invert': `var(--${currentColor.value}-700-invert)`,
            '--color-800-invert': `var(--${currentColor.value}-800-invert)`,
            '--color-900-invert': `var(--${currentColor.value}-900-invert)`,
            '--color-1000-invert': `var(--${currentColor.value}-1000-invert)`,
        }
    })
  
    const setButtonColor = (color: string | undefined) => {
        if (!color) return
        currentColor.value = color as ColorScheme
    }

    return {
        getButtonColors: colorProperties,
        setButtonColor
    }
}