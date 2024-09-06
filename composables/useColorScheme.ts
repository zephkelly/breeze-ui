export const useColorScheme = () => {
    const colorScheme = ref<'light' | 'dark' | null>(null)
    const isSystemColorScheme = ref(true)
    const systemPreference = ref<'light' | 'dark'>('light')

    const currentTheme = computed(() => {
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
        if (!import.meta.client) return;

        const storedScheme = localStorage.getItem('color-scheme')

        if (storedScheme === 'light' || storedScheme === 'dark') {
            isSystemColorScheme.value = false;
            colorScheme.value = storedScheme;

            applyColorScheme(storedScheme);
        } else {
            isSystemColorScheme.value = true;
            colorScheme.value = null;
            updateSystemPreference();

            document.documentElement.removeAttribute('data-color-scheme');
            localStorage.removeItem('color-scheme');
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', updateSystemPreference)
    }

    const applyColorScheme = (scheme: 'light' | 'dark' | null) => {
        if (import.meta.client) {
            if (scheme === null) {
                document.documentElement.removeAttribute('data-color-scheme')
                localStorage.removeItem('color-scheme')
            } else {
                document.documentElement.setAttribute('data-color-scheme', scheme)
                localStorage.setItem('color-scheme', scheme)
            }
        }
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
        })
    }

    return {
        colorScheme,
        isSystemColorScheme,
        currentTheme,
        toggleColorScheme,
        resetToSystem,
        systemPreference
    }
}