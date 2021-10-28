// 归类
/** 模块化封装后台api方法
 * 获取页面频道列表数据
 * 1.导入封装的axios方法
 * 导出摸个接口的请求方法
 * 目的：
 * 方便复用
 * 易于管理
 *  *  @param {*} data 登录信息：手机号/验证码
 */
import request from '../utils/request'
// export function getChannelApi () {
//   // 返回promise对象
//   return request({ url: 'channels' })
// }
export function getArticleListApi (params) {
  // 返回promise对象
  return request({ url: 'articles', params })
}
// 对文章不敢兴趣
export function disLikeById (target) {
  return request.post(
    'article/dislikes',
    {
      target
    })
}
// 根据文章ID举报
/**
 *
 * @param {*} target 文章ID
 * @param {*} type 举报类型
 */
export function reportById (target, type) {
  return request.post('article/reports', {
    target, type
  })
}
