import Vue from 'vue'
import Vuex from 'vuex'
// 导入本地持久化token方法 存储到硬盘中
import * as auth from '../utils/auth.js'
// console.log('* as 对象 获取模块的所有导出， ' , auth);
// 按需导入
import { login } from '../api/user'
Vue.use(Vuex)

export default new Vuex.Store({
  // 存储到内存中 刷新就没了
  state: {
    // 存储用户登录的token {token:string ，refresh_token: string}
    // user:{}
    // 存储到本地(硬盘)
    user: auth.getToken() || {}
  },
  mutations: {
    // 存
    setToken (state, token) {
      // 内存
      state.user = token
      // 存储到本地(硬盘)
      auth.setToken(token)
    },
    // 删
    delToken (state) {
      state.user = {}
      auth.delToken()
    }
  },
  actions: {
    // 登录
    async getToken ({ commit }, form) {
      const { data } = await login(form)
      console.log('token:', data)
      commit('setToken', data)
    }
  },
  modules: {
  }
})
