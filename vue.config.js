const webpack = require('webpack')
const path = require('path')

// 配置文件
const config = require('./src/config')
// 打包分析
// lodash按需引入
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const vueConfig = {
  // 静态资讯路径
  publicPath: config.assetsSrc,
  // 日志map(报错信息定位)
  productionSourceMap: false,
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
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    // 关闭预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          'primary-color': '#09C1C9',
          'link-color': '#09C1C9'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
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
