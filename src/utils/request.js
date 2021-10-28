/**
 * 封装全局axios方法(复用)
 * 1.导入 import axios from "axios";
 * 2. 使用 axios.create()方法创建一个axios实例
 * 3. 给新创建的axios实例添加了请求和响应拦截器 提高效率
 * 导出创建的新的axios实例
 */
import axios from 'axios'
import store from '../store/index'
// 导入router实例 等价于 this.$router
import router from '../router'
const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0/'
})
// 添加请求拦截器 ======》发送请求之前执行 成功第一个 失败第二个  添加请求头
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么===》同一为header添加token
  if (store.state.user.token && config.url !== 'authorizations') {
    /**
     * 需求：
     * 1. 有token
     * 2. 不是登录、注册等接口 加请求头暂时把authorizations排除
     * 采取添加haders的token
     * 说明：authorizations是登录的接口地址
     * 'Bearer ' + store.state.user.token 代言
     */
    // config.headers 是个对象：{}=> 追加
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器  =====》请求发送之后，后端响应了执行了 拦截器先拿到数据 重要的是return       简化返回给页面的数据

// 处理token失效401情况 用refresh获取新的token
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么=> 简化返回给页面的数据
  const _data = {
    status: response.status,
    data: response.data.data
  }
  return _data
  // try catch任何类型报错，js单线程
}, async function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。=>例如：401会进入这里
  // 对响应错误做点什么
  console.log('拦截器捕获到的错误：')
  console.dir(error)
  // 声明回调地址 携带参数的登录路由 名字不能乱取，在router中守卫有同样逻辑
  // js可以通过router.currentRouter.Path获取当前访问页面的地址
  // 暂时性死区
  const loginPath = `/login?redirectUrl=${router.currentRoute.path}`
  // 处理401情况：是否需要更新token
  try {
    if (error.response && error.response.status === 401) {
      console.log('处理401情况：是否需要更新token')
      /**
       * token失效(核心) 没登录过 没有token
       * 1）没登录 跳回登录页面(带上访问页面的地址)
       *
       *
       *
       * 2）已经登录 有token=>{token发请求，:token 失效，更新使用}
       * 1. token过期了，refresh_token没过期，用refresh_token发送请求续期，拿到最新的token 重新发送上次的401请求
       * 2. refresh_token也过期了，跳转到登录页面(带上访问401的地址)
      */
      //   1） 没有登录=》没有token
      //  从store中获取token
      const { user } = store.state
      if (!user.token || !user.refresh_token) {
        // router.replace不会有记录因为没有登陆过有记录也是无意义
        router.replace(loginPath)
        // 中断请求并抛出错误
        return Promise.reject(error)
      }
      /**
       * 2） 已经登录（核心）=》有token=》{token:发请求, refresh_token：token失效，更新时使用}
       */
      const { data } = await request({
        url: 'authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      console.log('获取到的新token：', data)
      // 存新的token
      store.commit('setToken',
        {
          token: data.token, // 存新的token
          refresh_token: user.refresh_token
        })
      return request(error.config)
    }
    // 练习的后天不能同一时刻使用同一账号会把第一次的token过期从而refresh_token生成新的token所以是两次
    // 同一个时刻只能同一个人登录
  } catch (error) {
    // 都过期了  跳转回登录页面（带上上次访问页面的地址）
    router.replace(loginPath)
    // 中断请求并抛出错误
    return Promise.reject(error)
  }
  return Promise.reject(error)
})

export default request
