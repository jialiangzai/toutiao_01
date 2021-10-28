
/**
 * 搜索文章
 * @param {*} page 页码
 * @param {*} per_page 每页条数
 * @param {*} q 搜索关键字
 */
import request from '@/utils/request'
// eslint-disable-next-line camelcase
export function searchArticles ({ page = 1, per_page = 20, q }) {
  return request.get('search', {
    params: {
      page,
      per_page,
      q
    }
  })
}
