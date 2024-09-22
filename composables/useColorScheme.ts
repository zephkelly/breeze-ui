import { type ColorScheme } from './../types/colorScheme';

export const useColorScheme = () => {
    const colorScheme: Ref<ColorScheme> = ref<ColorScheme>(null)
    const isSystemColorScheme = ref(true)
    const systemPreference = ref<'light' | 'dark'>('light')

    const colorSchemeCookie = useCookie('color-scheme', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
    })

    const currentScheme = computed(() => {
        if (isSystemColorScheme.value) {
            return systemPreference.value
        }

        return colorScheme.value
    })

    const getSystemPreference = (): 'light' | 'dark' => {
        if (import.meta.client && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        
        return 'light'
    }

    const updateSystemPreference = () => {
        systemPreference.value = getSystemPreference()
    }

    const initColorScheme = () => {
        if (import.meta.server) {
            const event = useRequestEvent();
            const serverColorScheme = event?.context?.colorScheme;
            if (serverColorScheme) {
                colorScheme.value = serverColorScheme as ColorScheme;
                isSystemColorScheme.value = false;
            }
        }
        else if (import.meta.client) {
            const storedScheme = localStorage.getItem('color-scheme') || colorSchemeCookie.value;
            if (storedScheme === 'light' || storedScheme === 'dark') {
                colorScheme.value = storedScheme as ColorScheme;
                isSystemColorScheme.value = false;
            }
            else {
                updateSystemPreference();
            }

            applyColorScheme(colorScheme.value);
        }
    }

    const applyColorScheme = (scheme: ColorScheme) => {
        if (import.meta.client) {
            document.documentElement.setAttribute('data-color-scheme', scheme || 'light')
            localStorage.setItem('color-scheme', scheme || 'light')
        }

        colorSchemeCookie.value = scheme || 'light';

        useHead({
            htmlAttrs: {
                'data-color-scheme': scheme || 'light'
            }
        })
    }
    
    const toggleColorScheme = () => {
        isSystemColorScheme.value = false

        if (colorScheme.value === null) {
            colorScheme.value = systemPreference.value === 'light' ? 'dark' : 'light'
        } else {
            colorScheme.value = colorScheme.value === 'light' ? 'dark' : 'light'
        }

        applyColorScheme(colorScheme.value)
    }

    const resetToSystem = () => {
        isSystemColorScheme.value = true
        colorScheme.value = null
        applyColorScheme(null)
    }

    watch(systemPreference, () => {
        if (isSystemColorScheme.value) {
            applyColorScheme(systemPreference.value)
        }
    })

    if (import.meta.client) {
        nextTick(() => {
            initColorScheme()
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', updateSystemPreference);
        })
    }

    return {
        colorScheme,
        isSystemColorScheme,
        currentScheme,
        toggleColorScheme,
        resetToSystem,
        systemPreference
    }
}