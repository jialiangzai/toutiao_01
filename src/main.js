import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入有赞组件库和样式
import Vant from 'vant'
import 'vant/lib/index.less'
// 引入全局自定义样式
import './styles/index.less'
// 引入 amfe-flexible 导入一个js包不给名字就会执行
import 'amfe-flexible'
Vue.config.productionTip = false
// 注册 对象  是一个vue组件
Vue.use(Vant)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
