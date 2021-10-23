// 归类
/** 模块化封装后台api方法
 * 用户验证
 * 1.导入封装的axios方法
 * 导出摸个接口的请求方法
 * 目的：
 * 方便复用
 * 易于管理
 *  @param {*} data 登录信息：手机号/验证码
 */

import request from '../utils/request'
export function login (data) {
  // 返回promise对象
  return request({ url: 'authorizations', method: 'POST', data })
}
