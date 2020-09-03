const webpack = require('webpack')
// lodash按需引入
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const vueConfig = {
  configureWebpack: {
    // debugger for chorme
    devtool: 'source-map',
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  chainWebpack: (config) => {
    if (process.env.NODE.ENV === 'production') {
      config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())
    }
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
   }
}
module.exports = vueConfig
