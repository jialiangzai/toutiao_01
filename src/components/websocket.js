// 创建连接（和服务器建立连接，回复你）
var ws = new WebSocket('wss://echo.websocket.org')

// 连接成功
ws.onopen = function (evt) {
  console.log('Connection open ...')
  // 发送消息
  ws.send('Hello WebSockets!')
}

// 接收信息
ws.onmessage = function (evt) {
  // 服务回复消息
  console.log('Received Message: ' + evt.data)
  // 关闭连接
  ws.close()
}

// 连接已经关闭
ws.onclose = function (evt) {
  console.log('Connection closed.')
}
