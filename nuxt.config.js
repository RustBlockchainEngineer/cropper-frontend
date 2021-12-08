import lessToJson from 'less-to-json'
import path from 'path'

const lessVariables = lessToJson('src/styles/variables.less')

export default {
  // server: {
  //   host: '0.0.0.0'
  // },

  srcDir: './src/',
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'CropperFinance',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      },
      { hid: 'description', name: 'description', content: 'The first permissionless yield farming protocol on Solana.' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  loadingIndicator: {
    name: 'circle',
    color: '#5ac4be',
    background: '#000'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    {
      src: '@/styles/antd.less',
      lang: 'less'
    },
    {
      src: '@/styles/global.less',
      lang: 'less'
    }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/axios.ts', '@/plugins/api.ts', '@/plugins/web3.ts', '@/plugins/notify.ts'],

  router: {
    middleware: ['route']
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/pwa',
    // https://typed-vuex.roe.dev
    'nuxt-typed-vuex'
  ],
  pwa: {
    meta: {
      title: 'Cropper',
      author: 'CropperFinance',
    },
    manifest: {
      short_name: "Cropper",
      name: "Cropper",
      description: "The Ultimate Yield Farming Protocol on Solana",
      start_url: "../",
      display: "standalone",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon"
        },
        {
          src: "/webapp.png",
          sizes: "72x72",
          type: "image/png"
        },
        {
          src: "/webapp.png",
          sizes: "152x152",
          type: "image/png"
        },
        {
          src: "/webapp.png",
          type: "image/png",
          sizes: "192x192"
        },
        {
          src: "/webapp.png",
          type: "image/png",
          sizes: "512x512"
        }
      ],
      lang: 'en',
      display: 'standalone'
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://fonts.gstatic.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://cdn.snipcart.com/.*',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        }
      ]
    }
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-clipboard',
    '@nuxtjs/dayjs',
    '@nuxtjs/google-gtag',
    '@nuxtjs/pwa'
    // '@nuxtjs/sentry'
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  clipboard: {
    autoSetContainer: true
  },

  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: ['utc']
  },

  'google-gtag': {
    id: 'G-NJ1QWMC2BD'
  },

  // sentry: {
  //   dsn: '',
  //   config: {}
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

    extend(config, ctx) {
        config.node = {
            fs: "empty"
        }
      },
    transpile: [/^ant-design-vue/],

    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: lessVariables
      }
    },

    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'lib',
            style: true
          },
          'ant-design-vue'
        ]
      ]
    },
  build: {
    extend(config, ctx) {
        config.node = {
            fs: "empty"
        },

      config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './src/utils/antd-icons.ts')
    }
},
  }
}