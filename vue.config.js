const webpack = require('webpack')
// 配置文件
const config = require('./src/config')
// 打包分析
// lodash按需引入
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const vueConfig = {
  // 静态资讯路径
  publicPath: config.assetsSrc,
  // 日志map(报错信息定位)
  productionSourceMap: process.env.NODE_ENV !== 'production',
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
    // 关闭预加载
    config.plugins.delete('prefetch')
  }
}
module.exports = vueConfig
