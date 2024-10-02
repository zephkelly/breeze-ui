import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs'
import { resolve as pathResolve, dirname } from 'path'
import { fileURLToPath } from 'url'

export interface ModuleOptions {
    theme: string
    colors: string
    devWarnings: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'breeze',
        configKey: 'breeze'
    },
    defaults: {
        theme: 'default',
        colors: 'default',
        devWarnings: false
    },
    setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url)
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
        const userThemesDir = pathResolve(nuxt.options.rootDir, 'breeze/css/themes')
        const userColorsDir = pathResolve(nuxt.options.rootDir, 'breeze/css/colors')

        nuxt.hook('components:dirs', (dirs) => {
            copyDefaultTheme(userThemesDir, resolve)
            copySpecifiedColors(options.colors, userColorsDir, resolve)
            setupThemes(options, nuxt, userThemesDir, resolve)
            setupColors(options, nuxt, userColorsDir, resolve)
        })

        // Make theme available in the app
        nuxt.options.runtimeConfig.public.breezeTheme = options.theme
        nuxt.options.runtimeConfig.public.breezeDevWarnings = options.devWarnings

        // Add plugins
        addPlugin(resolve(runtimeDir, 'plugins', 'theme'))
        addPlugin(resolve(runtimeDir, 'plugins', 'colorScheme'))
    }
})

function copyDefaultTheme(userThemesDir: string, resolve: Function) {
    if (!existsSync(userThemesDir)) {
        mkdirSync(userThemesDir, { recursive: true })
        console.log(`Created directory: ${userThemesDir}`)
    }

    const userDefaultThemePath = pathResolve(userThemesDir, 'default.css')
    if (!existsSync(userDefaultThemePath)) {
        const layerDefaultCssPath = resolve('../assets/css/themes/default.css')

        if (existsSync(layerDefaultCssPath)) {
            copyFileSync(layerDefaultCssPath, userDefaultThemePath)
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

function copySpecifiedColors(specifiedColor: string, userColorsDir: string, resolve: Function) {
    if (!existsSync(userColorsDir)) {
        mkdirSync(userColorsDir, { recursive: true })
        console.log(`Created directory: ${userColorsDir}`)
    }

    const validColors = ['default', 'accessible']
    const colorToCopy = validColors.includes(specifiedColor) ? specifiedColor : 'default'

    const userColorPath = pathResolve(userColorsDir, `${colorToCopy}.css`)
    
    if (!existsSync(userColorPath)) {
        const layerColorCssPath = resolve(`../assets/css/colors/${colorToCopy}.css`)

        if (existsSync(layerColorCssPath)) {
            copyFileSync(layerColorCssPath, userColorPath)
            console.log(`Copied ${colorToCopy}.css to: ${userColorPath}`)
        }
        else {
            console.warn(`Could not find ${colorToCopy}.css in the layer to copy.`)
        }
    }
    else {
        console.log(`${colorToCopy} color file already exists: ${userColorPath}`)
        console.log('Skipping color file copy to avoid overwriting existing file.')
    }
}

function setupThemes(options: ModuleOptions, nuxt: any, userThemesDir: string, resolve: Function) {
    if (!existsSync(userThemesDir)) {
        mkdirSync(userThemesDir, { recursive: true })
        console.log(`Created directory: ${userThemesDir}`)
    }

    if (options.theme !== 'none') {
        loadThemeCss(options, nuxt, userThemesDir, resolve)
    }
}

function setupColors(options: ModuleOptions, nuxt: any, userColorsDir: string, resolve: Function) {
    if (!existsSync(userColorsDir)) {
        mkdirSync(userColorsDir, { recursive: true })
        console.log(`Created directory: ${userColorsDir}`)
    }

    if (options.theme !== 'none') {
        loadThemeColors(options, nuxt, userColorsDir, resolve)
    }
}

function loadThemeCss(options: ModuleOptions, nuxt: any, userThemesDir: string, resolve: Function) {
    const loadTheme = (themeName: string) => {
        const userThemeCSSPath = pathResolve(userThemesDir, `${themeName}.css`)
        const moduleThemeCSSPath = resolve(`../assets/css/themes/${themeName}.css`)

        if (existsSync(userThemeCSSPath)) {
            nuxt.options.css.push(userThemeCSSPath)
            return true
        }
        else if (existsSync(moduleThemeCSSPath)) {
            nuxt.options.css.push(moduleThemeCSSPath)
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

function loadThemeColors(options: ModuleOptions, nuxt: any, userColorsDir: string, resolve: Function) {
    const loadThemeColors = (colorsName: string) => {
        const userThemeColorsCSSPath = pathResolve(userColorsDir, `${colorsName}.css`)
        const moduleThemeColorsCSSPath = resolve(`../assets/css/colors/${colorsName}.css`)

        if (existsSync(userThemeColorsCSSPath)) {
            nuxt.options.css.push(userThemeColorsCSSPath)
            return true
        }
        else if (existsSync(moduleThemeColorsCSSPath)) {
            nuxt.options.css.push(moduleThemeColorsCSSPath)
            return true
        }

        return false
    }

    if (!loadThemeColors(options.colors)) {
        console.warn(`Could not find theme colors CSS file for theme: ${options.colors}`)
        console.log('Falling back to default theme colors')

        options.colors = 'default'

        if (!loadThemeColors('default')) {
            console.error('Could not load default theme colors. Please ensure default-colors.css exists.')
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

// function copyDir(src: string, dest: string) {
//     mkdirSync(dest, { recursive: true })
//     const entries = readdirSync(src, { withFileTypes: true })

//     for (const entry of entries) {
//         const srcPath = pathResolve(src, entry.name)
//         const destPath = pathResolve(dest, entry.name)

//         if (entry.isDirectory()) {
//         copyDir(srcPath, destPath)
//         } else {
//         copyFileSync(srcPath, destPath)
//         }
//     }
// }