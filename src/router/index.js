import Vue from 'vue'
import VueRouter from 'vue-router'

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
Vue.use(VueRouter)
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
    // 二级路由
    children: [
      {
        path: '/',
        name: 'index',
        // 首页
        component: Index
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
    component: Article
  },
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})

export default router
