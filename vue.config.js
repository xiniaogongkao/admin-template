const webpack = require('webpack')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
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
    ]
  },
  chainWebpack: (config) => {
    if (process.env.NODE.ENV === 'production') {
      config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/less/index.less')]
    }
  }
}
module.exports = vueConfig
