import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 组件按需引入
import './core/lazy_use'
import 'moment/locale/zh-cn'
import './utils/filter' // global filter

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
