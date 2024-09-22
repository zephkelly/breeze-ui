import { useRuntimeConfig } from "nuxt/app"

export const useDevelopmentWarning = () => {
    const config = useRuntimeConfig()
    const devWarningsEnabled = config.public.breezeDevWarnings

    function devWarning(message: string)
    {
        if (devWarningsEnabled)
        {
            console.warn(`[BreezeUI]: ${message}`)
        }
    }

    return {
        devWarning
    }
}