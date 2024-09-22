import { useColorScheme } from './../../../composables/useColorScheme'

export default defineNuxtPlugin((nuxtApp) => {
    const { currentScheme, toggleColorScheme, resetToSystem, updateSystemPreference, setColorScheme } = useColorScheme()

    const colorSchemeCookie = useCookie('color-scheme', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
    })

    const applyColorScheme = (scheme: ColorScheme | null) => {
        const appliedScheme = scheme || currentScheme.value
        useHead({
            htmlAttrs: {
                'data-color-scheme': appliedScheme
            }
        })
        if (import.meta.client) {
            if (appliedScheme !== null) {
                document.documentElement.setAttribute('data-color-scheme', appliedScheme)
                localStorage.setItem('color-scheme', appliedScheme)
            }
        }
        colorSchemeCookie.value = scheme || 'system'
    }

    const initColorScheme = () => {
        if (import.meta.server) {
            const event = useRequestEvent()
            const serverColorScheme = event?.context?.colorScheme
            if (serverColorScheme) {
                setColorScheme(serverColorScheme as ColorScheme)
            }
        } else if (import.meta.client) {
            const storedScheme = localStorage.getItem('color-scheme') || colorSchemeCookie.value
            if (storedScheme === 'light' || storedScheme === 'dark') {
                setColorScheme(storedScheme as ColorScheme)
            } else {
                updateSystemPreference()
            }
        }
    }

    if (import.meta.server) {
        const event = useRequestEvent()
        const cookieColorScheme = colorSchemeCookie.value

        if (cookieColorScheme === 'light' || cookieColorScheme === 'dark') {
            setColorScheme(cookieColorScheme as ColorScheme)
        } else {
            const headerColorScheme = event?.node.req?.headers['sec-ch-prefers-color-scheme'] as ColorScheme
            setColorScheme(headerColorScheme || null)
        }

        if (event) {
            event.context.colorScheme = currentScheme.value
        }
    }

    if (import.meta.client) {
        updateSystemPreference()
        nuxtApp.hook('app:mounted', () => {
            initColorScheme()
            applyColorScheme(currentScheme.value)
        })

        watch(currentScheme, (newScheme) => {
            applyColorScheme(newScheme)
        })

        setTimeout(() => {
            document.documentElement.style.visibility = 'visible'
        }, 50)
    }

    return {
        provide: {
            currentScheme: readonly(currentScheme),
            toggleColorScheme,
            resetToSystemScheme: resetToSystem
        }
    }
})