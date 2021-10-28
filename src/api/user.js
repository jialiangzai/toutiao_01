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

/**
 * 关注用户
 * @param {*} target 用户ID
 */
export function follow (target) {
  return request.post('user/followings', { target })
}

/**
 * 取关用户
 * @param {*} target 用户ID
 */
export function unFollow (target) {
  return request.delete(`user/followings/${target}`)
}

/**
 * 对文章不喜欢
 * @param {*} target 文章ID
 */
export function disLike (target) {
  return request.post('article/dislikes', {
    target
  })
}

/**
 * 取消对文章不喜欢
 * @param {*} target 文章ID
 */
export function unDisLike (target) {
  return request.delete(`article/dislikes/${target}`)
}

/**
 * 对文章点赞
 * @param {*} target 文章ID
 */
export function like (target) {
  return request.post('article/likings', {
    target
  })
}

/**
 * 取消对文章点赞
 * @param {*} target 文章ID
 */
export function unLike (target) {
  return request.delete(`article/likings/${target}`)
}

/**
 * 获取用户个人信息
 */
export function getUserInfo () {
  return request.get('user')
}

/**
 * 获取个人中心用户编辑资料信息
 */
export function getUserProfile () {
  return request.get('user/profile')
}

/**
 * 修改用户头像
 * @param {File} photo - 选中图片后的文件对象
 */
export const updateUserPhoto = (photo) => {
  // 底层基于xhr  发送一个formdata就是上传
  // 1. 创建formData实例
  const formdata = new FormData()
  // 2. 把要上传的文件对象加入到formdata实例上 与后台接口一致
  formdata.append('photo', photo)
  return request.patch('user/photo', formdata)
}

/**
 * 修改用户信息
 * @param {String} name - 用户名
 * @param {Integer} gender - 性别 0 男 1 女
 * @param {String} birthday - 生日
 */
export const updateUserInfo = ({ name, gender, birthday }) => {
  return request.patch('user/profile', { name, gender, birthday })
}
