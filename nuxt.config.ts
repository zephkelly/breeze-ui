import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    modules: [
        join(currentDir, './modules/breeze')
    ],
    breeze: {
        theme: 'default',
        devWarnings: true,
    },
    css: ['./assets/css/base.css'],
    build: {
        transpile: ['breeze']
    },
    components: [
        {
            path: join(currentDir, './components'),
            pathPrefix: false,
            prefix: 'B'
        },
        {
            path: join(currentDir, './components/primitives'),
            pathPrefix: false,
            prefix: 'B'
        }
    ],
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
            script: [
                {
                    innerHTML: `
                    (function() {
                        function getInitialColorScheme() {
                            const cookie = document.cookie.split('; ').find(row => row.startsWith('color-scheme='));
                            if (cookie) {
                                const scheme = cookie.split('=')[1];
                                return scheme;
                            }

                            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                return 'dark';
                            }
                            else {
                                return 'light';
                            }
                        }
                        
                        const scheme = getInitialColorScheme();
                        
                        if (scheme === 'light') {
                            document.documentElement.style.backgroundColor = '#fafafa;';
                        }
                        else {
                            document.documentElement.style.backgroundColor = '#1c1c20';
                        }

                        window.addEventListener('load', () => {
                            document.documentElement.style.removeProperty('background-color');
                        });
                        
                        document.documentElement.setAttribute('data-color-scheme', scheme);
                    })();
                `,
                    type: 'text/javascript',
                },
            ],
        },
    }
})