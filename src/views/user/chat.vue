<template>
  <div class="container">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>
    <!-- 聊天内容区域（列表）一对一单聊 -->
    <div class="chat-list" ref="chatList">
      <div
        class="chat-item"
        :class="{ left: item.name === 'xz', right: item.name === 'my' }"
        v-for="(item, i) in list"
        :key="i"
      >
        <van-image v-if="item.name === 'xz'" fit="cover" round :src="xz" />
        <div class="chat-pao">{{ item.msg }}</div>
        <van-image v-if="item.name === 'my'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
      </div> -->
    </div>
    <!-- 发送聊天内容 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么..." @keyup.enter="send">
        <span @click="send()" slot="button" style="font-size: 12px; color: #999"
          >提交</span
        >
      </van-field>
    </div>
  </div>
</template>

<script>
// 引入xz头像
import xz from '@/assets/xz.png'
// socket 插件
import io from 'socket.io-client'
import { mapState } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      // 聊天发送的内容
      value: '',
      // xz头像
      xz,
      // 约定name为标识
      // 聊天内容列表-------- 聊天记录列表追加数据
      list: [
        // { name: 'xz', msg: '你好！137同学' },
        // { name: 'my', msg: '你好！小智' },
        // { name: 'xz', msg: '很高兴认识你' },
        // { name: 'my', msg: 'nice meet you!' }
      ],
      // ws/socket实例
      socket: null
    }
  },
  computed: {
    ...mapState('chat', ['photo'])
  },
  created () {
    this.initSocket()
  },
  // 组件销毁关闭连接，服务器也有长时间不用自动关闭 一般在接收到数据后就会调用
  deactivated () {
    this.socket.close()
  },

  methods: {
    // 初始化io
    initSocket () {
      // 第二个参数是配置
      this.socket = io('http://geek.itheima.net', {
        query: { token: this.$store.state.user.token },
        // 必须加因为新版本socket.io默认是socket模式，存在跨域问题。这里使用websocket模式，需要连接时指定！！！socket和websocket是不一样Socket是传输控制层协议，WebSocket是应用层协议。
        transports: ['websocket']
      })
      // 测试connect固定
      this.socket.on('connect', () => {
        console.log('连接成功！')
        // xz主动问候
        this.list.push({ name: 'xz', msg: '你好！137同学' })
      })
      // 接收服务器发的信息
      // this.socket.on('message', (data) => {
      //   console.log('客户端接收')
      // })
      // 发送 emit 字传父 接收on 绑定事件
      // 3. 接收服务器发的消息 message 接收的时候触发滚动事件
      this.socket.on('message', data => {
        // 接受机器人消息
        console.log('接收服务器发的消息:', data)
        this.list.push({ name: 'xz', msg: data.msg })
        this.scrollBottom()
      })
      // // 4.发送消息
      // this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      // this.list.push({ name: 'my', msg: this.value })
      // this.value = ''
    },
    /** 总结：我们关注的是客户端代码。
     - 发消息：socket.emit('message', '内容');=》客户端向服务器发消息
     - 收消息：socket.on('message', function(msg){}=》接收服务器的消息
     这个message后台同学提供的自定义事件名称
        */
    // 发送聊天内容（一问一答形式）
    send () {
      // 4.发送消息
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      this.list.push({ name: 'my', msg: this.value })
      this.value = ''
    },
    // 滚动列表到底部
    scrollBottom () {
      //  等list列表渲染完，执行滚动
      this.$nextTick(() => {
        // 获取dom元素
        const listDom = this.$refs.chatList
        // 滚动的高度是他自身的高度
        listDom.scrollTop = listDom.scrollHeight
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
