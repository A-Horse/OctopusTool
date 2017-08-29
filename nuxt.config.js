module.exports = {
  head: {
    title: 'site-tool',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'description', name: 'description', content: 'Developer and Designer Tool.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [

  ],
  loading: { color: '#3B8070' },
  plugins: [{ src: '~plugins/ga.js', ssr: false }],
  build: {
    extend (config, ctx) {
      config.module.rules.push({
        test: /worker.js$/,
        loader: 'worker-loader',
        exclude: /(node_modules)/
      })
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vender: ['axios']
  },
  generate: {
    routes: [
      '/',
      '/low-poly'
    ]
  }
}
