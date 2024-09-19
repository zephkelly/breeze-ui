import { useColorScheme } from './../../../composables/useColorScheme'

export default defineNuxtPlugin((nuxtApp) => {
    const { colorScheme, isSystemColorScheme, currentScheme, toggleColorScheme, resetToSystem, systemPreference } = useColorScheme()

    const setColorScheme = (scheme: string) => {
        colorScheme.value = scheme as 'light' | 'dark'
        useHead({
            htmlAttrs: {
                'data-color-scheme': scheme
            }
        })
        if (import.meta.client) {
            document.documentElement.setAttribute('data-color-scheme', scheme)
        }
    }

    if (import.meta.server) {
        const event = useRequestEvent()
        const colorSchemeCookie = useCookie('color-scheme')
        
        const cookieColorScheme = colorSchemeCookie.value
        
        if (cookieColorScheme === 'light' || cookieColorScheme === 'dark') {
            setColorScheme(cookieColorScheme)
            isSystemColorScheme.value = false
        }
        else {
            const headerColorScheme = event?.node.req?.headers['sec-ch-prefers-color-scheme']
            if (headerColorScheme === 'light' || headerColorScheme === 'dark') {
                setColorScheme(headerColorScheme)
                isSystemColorScheme.value = true
            }
            else {
                setColorScheme('light')
            }
        }
    
        if (event) {
            event.context.colorScheme = colorScheme.value || 'light'
        }
    }
    
    if (import.meta.client) {
        nuxtApp.hook('app:mounted', () => {
            const scheme = currentScheme.value
            if (scheme) {
                setColorScheme(scheme)
            }
        })

        setTimeout(() => {
            document.documentElement.style.visibility = 'visible'
        }, 50)
    }

      return {
        provide: {
          colorScheme,
          isSystemColorScheme,
          currentScheme,
          toggleColorScheme,
          resetToSystem,
          systemPreference
        }
    }
})