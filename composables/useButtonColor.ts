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