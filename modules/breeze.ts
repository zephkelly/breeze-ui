import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs'
import { resolve as pathResolve, dirname } from 'path'
import { fileURLToPath } from 'url'

export interface ModuleOptions {
  theme: string
  devWarnings: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'breeze',
        configKey: 'breeze'
    },
    defaults: {
        theme: 'default',
        devWarnings: false
    },
    setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url)
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
        const userThemesDir = pathResolve(nuxt.options.rootDir, 'assets/css/themes')
        // const userComponentsDir = pathResolve(nuxt.options.rootDir, 'components/ui')

        // Add base styles
        nuxt.hook('components:dirs', (dirs) => {
            // nuxt.options.css.push(resolve('../assets/css/base.css'))
            //   copyComponents(userComponentsDir, resolve('../components'))
            copyDefaultTheme(userThemesDir, resolve)
            setupThemes(options, nuxt, userThemesDir, resolve)
        })

        // Make theme available in the app
        nuxt.options.runtimeConfig.public.breezeTheme = options.theme
        nuxt.options.runtimeConfig.public.breezeDevWarnings = options.devWarnings

        // Add plugins
        addPlugin(resolve(runtimeDir, 'plugins', 'theme'))
        addPlugin(resolve(runtimeDir, 'plugins', 'colorScheme'))
        addPlugin(resolve(runtimeDir, 'plugins', 'colorSchemeHeader'))
    }
})

function setupThemes(options: ModuleOptions, nuxt: any, userThemesDir: string, resolve: Function) {
    if (!existsSync(userThemesDir)) {
        mkdirSync(userThemesDir, { recursive: true })
        console.log(`Created directory: ${userThemesDir}`)
    }

    if (options.theme !== 'none') {
        loadThemeCss(options, nuxt, userThemesDir, resolve)
    }
}

function copyDefaultTheme(userThemesDir: string, resolve: Function) {
    if (!existsSync(userThemesDir)) {
        mkdirSync(userThemesDir, { recursive: true })
        console.log(`Created directory: ${userThemesDir}`)
    }

    const userDefaultCssPath = pathResolve(userThemesDir, 'default.css')
    if (!existsSync(userDefaultCssPath)) {
        const layerDefaultCssPath = resolve('../assets/css/themes/default.css')

        if (existsSync(layerDefaultCssPath)) {
            copyFileSync(layerDefaultCssPath, userDefaultCssPath)
        // console.log(`Copied default.css to: ${userDefaultCssPath}`)
        }
        else {
            console.warn('Could not find default.css in the layer to copy.')
        }
    }
    else {
        // console.log(`Default theme already exists: ${userDefaultCssPath}`)
        // console.log('Skipping default theme copy to avoid overwriting existing file.')
    }
}

function loadThemeCss(options: ModuleOptions, nuxt: any, userThemesDir: string, resolve: Function) {
    const loadTheme = (themeName: string) => {
        const userThemeCssPath = pathResolve(userThemesDir, `${themeName}.css`)
        const moduleThemeCssPath = resolve(`../assets/css/themes/${themeName}.css`)

        if (existsSync(userThemeCssPath)) {
            // console.log(`Using user's theme CSS file: ${userThemeCssPath}`)
            nuxt.options.css.push(userThemeCssPath)
            return true
        }
        else if (existsSync(moduleThemeCssPath)) {
            // console.log(`Using module's theme CSS file: ${moduleThemeCssPath}`)
            nuxt.options.css.push(moduleThemeCssPath)
            return true
        }

        return false
    }

    if (!loadTheme(options.theme)) {
        console.warn(`Could not find theme CSS file for theme: ${options.theme}`)
        console.log('Falling back to default theme')

        options.theme = 'default'

        if (!loadTheme('default')) {
            console.error('Could not load default theme. Please ensure default.css exists.')
        }
    }
}

// function copyComponents(userComponentsDir: string, moduleComponentsDir: string) {
//     if (!existsSync(userComponentsDir)) {
//         copyDir(moduleComponentsDir, userComponentsDir)
//         console.log(`Copied components to: ${userComponentsDir}`)
//     } else {
//         console.log(`User components directory already exists: ${userComponentsDir}`)
//         console.log('Skipping component copy to avoid overwriting existing files.')
//     }
// }

function copyDir(src: string, dest: string) {
    mkdirSync(dest, { recursive: true })
    const entries = readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath = pathResolve(src, entry.name)
        const destPath = pathResolve(dest, entry.name)

        if (entry.isDirectory()) {
        copyDir(srcPath, destPath)
        } else {
        copyFileSync(srcPath, destPath)
        }
    }
}