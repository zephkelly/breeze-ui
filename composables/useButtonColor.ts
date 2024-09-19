import { type ColorSchemeNuxtAppContext, type ColorScheme } from './../types/colorScheme'

interface ColorwayVariables {
    [key: string]: string
  }
  
  export function useButtonColor(colorway: Ref<string | undefined>) {
    const nuxtApp = useNuxtApp()
    const { $currentScheme } = nuxtApp as unknown as ColorSchemeNuxtAppContext
  
    const colorwayVariables = ref<ColorwayVariables>({})
  
    const setColorVariables = () => {
      if (!colorway.value) {
        return colorwayVariables.value = {}
      }
  
      let currentColorway = colorway.value
      let currentScheme = $currentScheme.value
      const states = ['', '-hover', '-active']
      const extras = ['-border', '-text']
  
      const newVariables: ColorwayVariables = {}
  
      // For other colorways
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