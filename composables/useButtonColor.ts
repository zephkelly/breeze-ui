import { type ColorSchemeNuxtAppContext } from './../types/colorScheme'

interface ColorwayVariables {
    [key: string]: string
  }
  
export function useButtonColor(colorway: Ref<string | undefined>) {
    const nuxtApp = useNuxtApp()
    const { $currentScheme } = nuxtApp as unknown as ColorSchemeNuxtAppContext
  
    const colorwayVariables = ref<ColorwayVariables>({})
  
    const setColorVariables = () => {
        const currentColorway = colorway.value || ''
        const currentScheme = $currentScheme.value
        const variants = ['foreground', 'background']
        const states = ['', '-hover', '-active']
        const extras = ['-border', '-text']
    
        const newVariables: ColorwayVariables = {}
    
        variants.forEach(variant => {
            states.forEach(state => {
                const baseVar = currentColorway
                    ? `--${currentColorway}${state}-${variant}-${currentScheme}`
                    : `--${variant}${state}-${currentScheme}`
                const newVar = `--colorway-${variant}${state}`
                newVariables[newVar] = `var(${baseVar})`
            })
            extras.forEach(extra => {
                const baseVar = currentColorway
                    ? `--${currentColorway}${extra}-${variant}-${currentScheme}`
                    : `-${extra}-${variant}-${currentScheme}`
                const newVar = `--colorway-${variant}${extra}`
                newVariables[newVar] = `var(${baseVar})`
            })
        })
    
        colorwayVariables.value = newVariables
    }
  
    const colorStyle = computed(() => {
        return Object.entries(colorwayVariables.value).reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
        }, {} as Record<string, string>)
    })
  
    watch([colorway, $currentScheme], setColorVariables, { immediate: true })
  
    return {
        colorStyle,
        setColorVariables
    }
}