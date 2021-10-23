// 提供存储 获取 删除
// 存储token是一个对象 {token:string ，refresh_token: string} ====》token0登录凭证 和 更新token(延长登录时间)

// 存储token的名字
const TT_TOKEN_137 = 'TT_TOKEN_137'
// 存储token
export function setToken (token) {
  localStorage.setItem(TT_TOKEN_137, JSON.stringify(token))
}
// 获取token 要转换成对象
export function getToken () {
  JSON.parse(localStorage.getItem(TT_TOKEN_137))
}
// 删除
export function delToken () {
  localStorage.removeItem(TT_TOKEN_137)
}
