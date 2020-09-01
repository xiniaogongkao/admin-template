const webpack = require('webpack')
// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// lodash按需引入
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const vueConfig = {
  configureWebpack: {
    // debugger for chorme
    devtool: 'source-map',
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new BundleAnalyzerPlugin({
        defaultSizes: 'parsed'
      })
    ]
  },
  chainWebpack: (config) => {
    if (process.env.NODE.ENV === 'production') {
      config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())
    }
   }
}
module.exports = vueConfig
