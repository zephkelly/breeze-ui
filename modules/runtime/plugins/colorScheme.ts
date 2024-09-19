import { useColorScheme } from './../../../composables/useColorScheme'

export default defineNuxtPlugin((nuxtApp) => {
    const { colorScheme, isSystemColorScheme, currentScheme, toggleColorScheme, resetToSystem, systemPreference } = useColorScheme()

    if (import.meta.server) {
        const event = useRequestEvent()
        const colorSchemeCookie = useCookie('color-scheme')
        
        // Check for color scheme in cookie
        const cookieColorScheme = colorSchemeCookie.value
        
        if (cookieColorScheme === 'light' || cookieColorScheme === 'dark') {
          colorScheme.value = cookieColorScheme
          isSystemColorScheme.value = false
        } else {
          const headerColorScheme = event?.node.req?.headers['sec-ch-prefers-color-scheme']
          if (headerColorScheme === 'light' || headerColorScheme === 'dark') {
            colorScheme.value = headerColorScheme
            isSystemColorScheme.value = true
          }
        }
    
        // Set the color scheme in the event context for other server-side code to use
        if (event) {
            event.context.colorScheme = colorScheme.value || 'light'
        }

        useHead({
            htmlAttrs: {
                'data-color-scheme': colorScheme.value || 'light'
            }
        })
      }
    
      if (import.meta.client) {
        nuxtApp.hook('app:mounted', () => {
            const scheme = currentScheme.value
            if (scheme) {
                document.documentElement.setAttribute('data-color-scheme', scheme)
            }
        })
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