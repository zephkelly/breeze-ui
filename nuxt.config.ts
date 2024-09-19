import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
    compatibilityDate: '2024-09-15',
    devtools: { enabled: true },
    components: [
        {
          path: join(currentDir, './components/ui'),
          pathPrefix: false,
          prefix: 'Breeze'
        }
    ],
    modules: [
        join(currentDir, './modules/breeze'),
        'nuxt-purgecss',
    ],
    breeze: {
        theme: 'default'
    },
    typescript: {
        typeCheck: true,
    },
    dir: {
        assets: 'assets',
        modules: 'modules',
        plugins: 'plugins',
    },
    imports: {
        dirs: [
            'types/**',
            'themes/**',
            'modules/**',
            'plugins/**',
        ]
    },
    app: {
        head: {
            htmlAttrs: {
                'data-color-scheme': ''
            }
        }
    },
    // hooks: {
    //     'pages:extend' (pages) {
    //       function setMiddleware (pages: any[]) {
    //         for (const page of pages) {
    //           if (/* some condition */ true) {
    //             page.meta ||= {}
    //             // Note that this will override any middleware set in `definePageMeta` in the page
    //             page.meta.middleware = ['colorScheme']
    //           }
    //           if (page.children) {
    //             setMiddleware(page.children)
    //           }
    //         }
    //       }
    //       setMiddleware(pages)
    //     }
    //   }
})