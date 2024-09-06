import { useColorScheme } from '~/composables/useColorScheme'

export default defineNuxtPlugin((nuxtApp) => {
    const { colorScheme, isSystemColorScheme, currentTheme, toggleColorScheme, resetToSystem, systemPreference } = useColorScheme()

    if (import.meta.client) {
        nuxtApp.hook('app:mounted', () => {
            const scheme = colorScheme.value || (isSystemColorScheme.value ? systemPreference.value : null)
            
            if (scheme) {
                document.documentElement.setAttribute('data-color-scheme', scheme)
            }
        })
    }

    return {
        provide: {
            colorScheme,
            isSystemColorScheme,
            currentTheme,
            toggleColorScheme,
            resetToSystem,
            systemPreference
        }
    }
})