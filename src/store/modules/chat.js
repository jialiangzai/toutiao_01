/**
 * 存储聊天头像
 */
export default {
  namespaced: true, // 开启命名空间
  state: {
    // 登录人头像
    photo: localStorage.getItem('TT_PT') || ''
  },
  mutations: {
    /**
     *
     * @param {*} state 变量对象
     * @param {*} payload 外部调用setPhoto方法传入的参数
     */
    setPhoto (state, payload) {
      state.photo = payload
      localStorage.setItem('TT_PT', payload)
    }
  }
}
