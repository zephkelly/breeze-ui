import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    modules: [join(currentDir, './modules/breeze')],
    breeze: {
        theme: 'default',
        devWarnings: true,
    },
    components: [
        {
          path: join(currentDir, './components/primitives'),
          pathPrefix: false,
          prefix: 'B'
        }
    ],
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
})