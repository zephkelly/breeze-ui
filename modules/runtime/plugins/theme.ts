export default defineNuxtPlugin((nuxtApp) => {
    const theme = useRuntimeConfig().public.breezeTheme
        
    return {
        provide: {
            breezeTheme: theme
        }
    }
})