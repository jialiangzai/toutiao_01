
/**
 *
 * */
import request from '../utils/request'

export function getChannelApi () {
  // 返回promise对象
  return request({ url: 'channels' })
}

/**
 * 获取当前登录人频道列表数据=》 不强制用户登录，匿名用户返回后台设置的默认频道列表
 * @returns
 */
export function getUserChannelApi () {
  return request({ url: 'user/channels' })
}

/**
 * 删除频道
 * @param {*} channelId 频道ID
 */
export function delChannel (channelId) {
  return request.delete(`user/channels/${channelId}`)
}

/**
 * 添加频道
 * @param {*} newChannel:Array 新的频道数据
 */
export function addChannelApi (newChannel) {
  return request.put('user/channels', {
    channels: newChannel
  })
}
