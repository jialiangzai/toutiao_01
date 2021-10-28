
import request from '@/utils/request'

/**
 * 获取文章详情
 * @param {*} id 根据文章ID获取文章详情
 */
export function getDetailById (id) {
  return request.get(`articles/${id}`)
}

/**
 * 获取评论或回复
 * @param {String} type - a 查询文章的评论  c 查询评论的回复
 * @param {String} source - 如果查询评论是文章的ID  如果查询回复是评论的ID
 * @param {String} offset - 查询每一页数据的最后一个数据的ID，当作下一页的偏移量
 * @param {String} limit - 每页显示多少条
 * 当请求没有传递参数的时候会使用函数参数的对象(可以解构)
 */
export function getComments ({ type, source, offset, limit = 10 }) {
  return request.get('comments', {
    params: {
      type, source, offset, limit
    }
  })
}

/**
 * 提交评论或者回复
 * @param {String} target - 做评论的时候：文章ID  做回复的时候：评论ID
 * @param {String} content - 评论内容
 * @param {String} artId - 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数
 */
export const commentOrReply = (target, content, art_id = null) => {
  return request.post('comments', { target, content, art_id })
}
