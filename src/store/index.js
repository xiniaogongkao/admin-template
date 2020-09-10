import Vue from 'vue'
import Vuex from 'vuex'

// import app from './modules/app'
import { getDic } from '@/api/apiList'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    // 字典对象
    dicObj: {}
  },
  mutations: {
    SET_DIC: (state, dicObj) => {
      state.dicObj = dicObj
    }
  },
  actions: {
    // 获取全局字典
    GetDicData({ commit }) {
      getDic().then(res => {
        const result = res.data || {}
        commit('SET_DIC', result)
      })
    }
  },
  getters: {
    dicObj: state => state.dicObj
  }
})
