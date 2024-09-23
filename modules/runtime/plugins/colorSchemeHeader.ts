export default defineNuxtPlugin((nuxtApp) => {
    const colorScheme = useColorScheme()
  
    nuxtApp.hook('app:created', () => {
      if (import.meta.client) {
        const getSystemPreference = (): 'light' | 'dark' => {
          if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          }
          return 'light'
        }
  
        const systemPreference = getSystemPreference()
        
        // Add the system preference to all request headers
        nuxtApp.vueApp.config.globalProperties.$fetch = $fetch.create({
          headers: {
            'X-Color-Scheme-Preference': systemPreference
          }
        })
      }
    })
})