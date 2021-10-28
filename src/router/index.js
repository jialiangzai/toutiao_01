import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入vuex实例=>store === 页面中的this.$store store有存储本地数据
import store from '@/store'
// 路由懒加载
// import Login from '../views/login/index.vue'

/**
 * 路由配置
 */
/**
 * 前端路由配置的两种方式
 * 1. hash模式(默认)
 * 2. history模式
 * 相同点：都可以实现路由配置和跳转（功能一样）
 * 不同点：路由的路径不一样=》hash模式带个#号；history不带
 * 使用场景：
 * 一般使用hash模式，因为hash可以运行在所有浏览器（兼容性好）；
 * 但是history模式只能在支持history api的浏览器运行
 */
const Layout = () => import('@/views/layout.vue')
// 首页（第一个标签页）
const Index = () => import('@/views/home/index.vue')
// 问答
const Question = () => import('@/views/question/index.vue')
// 视频
const Video = () => import('@/views/video/index.vue')
// 个人中心
const Profile = () => import('@/views/profile/index.vue')
// 登录
// 按需导入 函数 在需要的时候调用
const Login = () => import('../views/login/index.vue')
// 编辑个人资料
const User = () => import('@/views/user/edit.vue')
// 小智
const Chat = () => import('@/views/user/chat.vue')
// 搜索
const Search = () => import('@/views/search/index.vue')
const Result = () => import('@/views/search/result.vue')
// 详情
const Article = () => import('@/views/article/index.vue')
const NotFound = () => import('@/views/NotFound')

const routes = [
  {
    path: '/',
    // 布局骨架
    component: Layout,
    // 二级路由 子依赖父，子渲染父也会渲染，父中要有router-view
    children: [
      {
        path: '/',
        name: 'index',
        // 首页
        component: Index,
        // 开启缓存
        meta: {
          isKeepAlive: true
        }
      },
      {
        path: '/question',
        name: 'question',
        // 问答
        component: Question
      },
      {
        path: '/video',
        name: 'video',
        // 视频
        component: Video
      },
      {
        path: '/user',
        name: 'user',
        // 个人中心
        component: Profile
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    // 登录
    component: Login
  },
  {
    path: '/user/profile',
    name: 'profile',
    // 编辑资料
    component: User
  },
  {
    path: '/user/chat',
    name: 'chat',
    // 小智同学
    component: Chat
  },
  {
    path: '/search',
    name: 'search',
    // 搜索
    component: Search
  },
  {
    path: '/search/result',
    name: 'result',
    // 搜索结果
    component: Result
  },
  {
    path: '/article/:id',
    name: 'article',
    // 文章详情
    component: Article,
    // 开启缓存
    meta: {
      isKeepAlive: true
    }
  },
  {
    path: '*',
    component: NotFound
  }
]
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})
// 添加路由全局前置守卫 控制'/user'开头的页面访问 如果没token就要转登录页面
router.beforeEach((to, from, next) => {
  /** to  对象 去哪里
   * from  对象  来自哪里
   * next(方法)
   * token 存储到vuex中 做了持久化 ，不要操作本地 ，vuex能做到本地刷新还在用vuex技术
   * 用js导入一个vuex的实例，虽然得不到vue文件但是可以拿到实例
   * store === this.$store
   * .startsWith('xxx') 是否是xxx开头
   * next()也可以跳页面 ==== router.push()
   * 把用户当前访问的没登录的页面to.path当做参数，带到登录页 没登录--去登录--登陆完---返回之前没登录访问的页面to.path
   * 新版路由有错误代码未错 ，在Vue.(VueRouter)注册VueRouter之前加代码
   * redirectUrl是键的名字自定义
   * */
  const { user } = store.state
  // 只是判断是否有token值，没有判断token的有效期
  if (to.path.startsWith('/user') && !user.token) {
    next(`/login?redirectUrl=${to.path}`)
  } else {
    next()
  }
})

export default router
