import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入有赞组件库和样式
// 懒加载
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
// 引入全局自定义样式
import './styles/index.less'
// 引入 amfe-flexible 导入一个js包不给名字就会执行
import 'amfe-flexible'
import Plugins from './utils/plugins.js'
Vue.config.productionTip = false
// 注册 对象  是一个vue组件 ===》图片进入可视区才会加载渲染 具名插槽是引入了内置为组件     第三方vue-lazyload
Vue.use(Vant)
// 注册自定义插件 全局使用
Vue.use(Plugins)
// 注册懒加载
Vue.use(Lazyload)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
