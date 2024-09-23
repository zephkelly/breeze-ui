import { useColorScheme } from '../../../composables/useColorScheme'
import type { ColorScheme } from '../../../types/colorScheme'

export default defineNuxtPlugin((nuxtApp) => {
    const { currentScheme, toggleColorScheme, resetToSystem, updateSystemPreference, setColorScheme, isSystemColorScheme } = useColorScheme()
   
    const colorSchemeCookie = useCookie('color-scheme', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
    })

    const applyColorScheme = (scheme: ColorScheme) => {
        useHead({
            htmlAttrs: {
                'data-color-scheme': scheme
            }
        })
        if (import.meta.client) {
            document.documentElement.setAttribute('data-color-scheme', scheme)
        }
        
        colorSchemeCookie.value = isSystemColorScheme.value ? 'system' : scheme
        console.log(isSystemColorScheme.value)
        console.log(colorSchemeCookie.value)
    }

    const getSystemPreference = (): 'light' | 'dark' => {
        if (import.meta.client && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    }

    const initColorScheme = () => {
        const storedScheme = colorSchemeCookie.value as ColorScheme | 'system' | undefined
        if (storedScheme && storedScheme !== 'system') {
            setColorScheme(storedScheme)
        } else {
            const systemPreference = getSystemPreference()
            setColorScheme(systemPreference)
        }
        //@ts-expect-error
        applyColorScheme(currentScheme.value)
    }

    if (import.meta.server) {
        initColorScheme()
        const event = useRequestEvent()
        if (event) {
            event.context.colorScheme = currentScheme.value
            event.context.systemPreference = getSystemPreference()
        }
    }

    if (import.meta.client) {
        nuxtApp.hook('app:created', () => {
            initColorScheme()
        })

        nuxtApp.hook('app:mounted', () => {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => {
                if (isSystemColorScheme.value) {
                    const newSystemPreference = getSystemPreference()
                    setColorScheme(newSystemPreference)
                    applyColorScheme(newSystemPreference)
                }
            }
            mediaQuery.addEventListener('change', handleChange)
        })
   
        watch(currentScheme, (newScheme) => {
            //@ts-expect-error
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