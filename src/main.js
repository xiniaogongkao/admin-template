import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 组件按需引入
import './core/lazy_use'
import 'moment/locale/zh-cn'
import './utils/filter' // global filter
import 'ant-design-vue/dist/antd.less'
import './assets/less/global.less'
import './assets/less/cover.less'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

Vue.config.productionTip = false

Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
