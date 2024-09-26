import { useColorScheme } from '../../../composables/useColorScheme'
import type { ColorScheme } from '../../../types/colorScheme'

type ColorSchemeSource = 'system' | 'user' | 'cookie'

export default defineNuxtPlugin((nuxtApp) => {
    const { currentColorScheme, currentUserColorScheme, updateSystemColorScheme, updateUserColorScheme, toggleUserColorScheme, applySystemColorScheme } = useColorScheme()
    
    const colorSchemeCookie = useCookie('color-scheme', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
    })

    function getInitialColorScheme(): ColorScheme {
        const storedScheme = colorSchemeCookie.value as ColorScheme | undefined
        if (storedScheme !== undefined && storedScheme !== null) {
            return storedScheme
        }
        if (import.meta.client) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light' // Default to light if we can't determine
    }

    function setSystemColorScheme() {
        if (colorSchemeCookie.value) {
            colorSchemeCookie.value = null
        }

        applySystemColorScheme();
    }

    function applyColorScheme(scheme: ColorScheme | null, schemeSource: ColorSchemeSource) {
        if (scheme === null) return;

        useHead({
            htmlAttrs: {
                'data-color-scheme': scheme
            }
        })

        if (import.meta.client) {
            if (schemeSource === 'user') {
                colorSchemeCookie.value = scheme
            }
            else if (schemeSource === 'system') {
                colorSchemeCookie.value = null
            }
            
            document.documentElement.setAttribute('data-color-scheme', scheme)
        }
    }

    if (import.meta.server) {
        const storedScheme = colorSchemeCookie.value as ColorScheme | undefined
        if (storedScheme) {
            applyColorScheme(storedScheme, 'cookie')
        }
    }

    if (import.meta.client) {
        watch(currentColorScheme, (newScheme) => {
            if (currentUserColorScheme().value === null) {
                applyColorScheme(newScheme, 'system')
            }
            else {
                applyColorScheme(newScheme, 'user')
            }
        })
    }

    nuxtApp.hook('app:created', () => {
        const storedScheme = colorSchemeCookie.value as ColorScheme | undefined

        if (storedScheme) {
            applyColorScheme(storedScheme, 'cookie')
            updateUserColorScheme(storedScheme)
            return;
        }

        // applyColorScheme(currentColorScheme.value, 'system')
    })

    nuxtApp.hook('app:mounted', () => {
        updateSystemColorScheme()
    });

    return {
        provide: {
            currentColorScheme, currentUserColorScheme,
            toggleColorScheme: toggleUserColorScheme,
            setSystemColorScheme: setSystemColorScheme,
            getInitialColorScheme
        }
    }
});