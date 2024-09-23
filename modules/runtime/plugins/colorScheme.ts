import { useColorScheme } from './../../../composables/useColorScheme'
import type { ColorScheme } from './../../../types/colorScheme'

export default defineNuxtPlugin((nuxtApp) => {
    const { currentScheme, toggleColorScheme, resetToSystem, updateSystemPreference, setColorScheme, isSystemColorScheme } = useColorScheme()
    
    const colorSchemeCookie = useCookie('color-scheme', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
    })

    const applyColorScheme = (scheme: ColorScheme | null) => {
        const appliedScheme = scheme || currentScheme.value || 'light'
        useHead({
            htmlAttrs: {
                'data-color-scheme': appliedScheme
            }
        })
        if (import.meta.client) {
            document.documentElement.setAttribute('data-color-scheme', appliedScheme)
            localStorage.setItem('color-scheme', isSystemColorScheme.value ? 'system' : appliedScheme)
        }
        colorSchemeCookie.value = isSystemColorScheme.value ? 'system' : appliedScheme
    }

    const initColorScheme = () => {
        const storedScheme = colorSchemeCookie.value as ColorScheme | 'system' | undefined
        if (storedScheme === 'light' || storedScheme === 'dark') {
            setColorScheme(storedScheme)
        } else {
            resetToSystem()
            updateSystemPreference()
        }
        applyColorScheme(currentScheme.value)
    }

    if (import.meta.server) {
        const event = useRequestEvent()
        initColorScheme()
       
        if (event) {
            event.context.colorScheme = currentScheme.value
        }
        useHead({
            htmlAttrs: {
                'data-color-scheme': currentScheme.value
            }
        })
    }

    if (import.meta.client) {
        nuxtApp.hook('app:mounted', () => {
            initColorScheme()
       
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => {
                if (isSystemColorScheme.value) {
                    updateSystemPreference()
                    applyColorScheme(currentScheme.value)
                }
            }
            mediaQuery.addEventListener('change', handleChange)
        })
   
        watch(currentScheme, (newScheme) => {
            applyColorScheme(newScheme)
        })
    }

    return {
        provide: {
            currentScheme: readonly(currentScheme),
            toggleColorScheme,
            resetToSystemScheme: resetToSystem
        }
    }
})