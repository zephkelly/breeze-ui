import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { fileURLToPath } from 'url'

export default defineNuxtModule({
    meta: {
        name: 'breeze',
        configKey: 'breeze'
    },
    defaults: {
        theme: 'default'
    },
    setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url)
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

        // Always add base styles
        nuxt.options.css.push(resolve('../assets/css/base.css'))

        // Add theme-specific styles if theme is not 'none'
        if (options.theme !== 'none') {
        nuxt.options.css.push(resolve(`../assets/css/themes/${options.theme}.css`))
        }

        // Make theme available in the app
        nuxt.options.runtimeConfig.public.breezeTheme = options.theme

        // Add a plugin to inject the theme into the app context
        addPlugin(resolve(runtimeDir, 'plugins', 'theme'))
        addPlugin(resolve(runtimeDir, 'plugins', 'colorScheme'))
    }
})