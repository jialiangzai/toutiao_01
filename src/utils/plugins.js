// Vue插件
/**
 * vue插件
 * 语法：{install(Vue){}} vue是形参 可自定义
 * 使用：需要去入口main.js中注册=》Vue.use(我的插件对象)
 */
// 时间格式化
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
// 国际化
import 'dayjs/locale/zh-cn'

// 导入Modal
import Modal from '../components/v_model.vue'
dayjs.locale('zh-cn')
// 添加插件
dayjs.extend(relativeTime)

// 相对时间换算
/**
 *
 * @param {*} value 获取模版中值：val | filter 管道符左边的
 */
const relTime = (value) => {
  // console.log(dayjs())
  return dayjs().from(value)
}
// 睡眠函数
const $seelp = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time || 2000)
  })
}
export default {
  // Vue是形参 返回的是Vue构造函数
  install (Vue) {
    // console.log('Vue构造函数', Vue)
    /** 使用场景：注册全局过滤器、组件、指令、挂载全局公共方法
 */
    Vue.prototype.$seelp = $seelp
    // 全局格式化相对时间过滤器
    Vue.filter('relTime', relTime)
    Vue.component('Modal', Modal)
  }
  //   install (Vue) {
  //     // console.log('Vue构造函数', Vue)
  //     /** 使用场景：注册全局过滤器、组件、指令、挂载全局公共方法
  //  */
  //     Vue.prototype.$seelp = $seelp
  //     Vue.filter('relTime', relTime)
  //   }

}
