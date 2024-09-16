import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    components: [
        {
          path: join(currentDir, './components/ui'),
          pathPrefix: false,
          prefix: 'Breeze'
        }
    ],
    modules: [join(currentDir, './modules/breeze')],
    breeze: {
        theme: 'default'
    },
    typescript: {
        typeCheck: true,
    },
})
