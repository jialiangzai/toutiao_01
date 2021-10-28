/**
 * 联想自动补全
 * @param {*} q 搜索词
 */

import request from '@/utils/request'

export function suggest (q) {
  return request.get('suggestion', {
    params: {
      q
    }
  })
}
/**
 * 搜索文章
 * @param {*} page 页码
 * @param {*} per_page 每页条数
 * @param {*} q 搜索关键字
 */
