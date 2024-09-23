import { type ColorSchemeNuxtAppContext, type ColorScheme } from './../types/colorScheme'

interface ColorwayVariables {
    [key: string]: string
}

export function useButtonColor() {
    const nuxtApp = useNuxtApp()
    const { $currentScheme } = nuxtApp as unknown as ColorSchemeNuxtAppContext
  
    const colorProperties = ref<ColorwayVariables>({})
  
    const calculateColor = (colorway: string | undefined) => {
        if (!colorway) {
            return {}
        }
    
        let currentColorway = colorway
        let currentScheme = $currentScheme.value
        const states = ['', '-hover', '-active']
        const extras = ['-border', '-text']
    
        const newVariables: ColorwayVariables = {}
    
        states.forEach(state => {
            const baseVar = `--${currentColorway}-foreground${state}-${currentScheme}`
            const newVar = `--colorway${state}`
            newVariables[newVar] = `var(${baseVar})`
        })
    
        extras.forEach(extra => {
            const baseVar = `--${currentColorway}-foreground${extra}-${currentScheme}`
            const newVar = `--colorway${extra}`
            newVariables[newVar] = `var(${baseVar})`
        })
    
        // Set contrast variables
        states.forEach(state => {
            const baseVar = `--${currentColorway}-background${state}-${currentScheme}`
            const newVar = `--colorway-contrast${state}`
            newVariables[newVar] = `var(${baseVar})`
        })
    
        extras.forEach(extra => {
            const baseVar = `--${currentColorway}-background${extra}-${currentScheme}`
            const newVar = `--colorway-contrast${extra}`
            newVariables[newVar] = `var(${baseVar})`
        })

        colorProperties.value = newVariables
        return newVariables
    }

    return {
        colorProperties,
        calculateColor
    }
}