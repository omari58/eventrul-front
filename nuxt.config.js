require('dotenv').config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Eventrul',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: 'msapplication-TileColor',
        content: '#da532c'
      },
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
    ],

    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js',
        type: 'text/javascript'
      },
      {
        src:
          'https://cdn.jsdelivr.net/npm/fomantic-ui@2.7.5/dist/semantic.min.js',
        type: 'text/javascript'
      },
      {
        src: '/pipedrive.js',
        type: 'text/javascript'
      },
      {
        src: 'https://leadbooster-chat.pipedrive.com/assets/loader.js',
        type: 'text/javascript',
        async: true
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~assets/scss/main.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~semantic/dist/semantic.min.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/fontawesome',
    '~/plugins/globals',
    { src: '~/plugins/vuex-persist', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/moment',
    '@nuxtjs/dotenv',
    'vue-scrollto/nuxt'
  ],

  moment: {
    locales: ['et'],
    defaultLocale: 'et'
  },

  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:3333',
      // target: 'https://instaevent-project-002.appspot.com',
      pathRewrite: {
        '^/api': ''
      }
    }
  },

  styleResources: {
    scss: ['~assets/scss/_variables.scss']
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
