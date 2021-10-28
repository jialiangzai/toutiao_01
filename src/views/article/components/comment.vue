<template>
  <div class="comment">
    <!-- 评论列表 -->
    <!-- :immediate-check="false"关闭列表自动加载=》手动控制 -->
    <van-list
      v-model="loading"
      :finished="finished"
      @load="loadComments"
      finished-text="没有更多了"
      :immediate-check="false"
    >
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="(com, index) in comments"
        :key="index"
      >
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="com.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ com.aut_name }}</span>
            <span style="float: right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ com.like_count }}</span>
            </span>
          </p>
          <p>{{ com.content }}</p>
          <p>
            <span class="time">{{ com.pubdate | relTime }}</span
            >&nbsp;
            <!-- <van-tag plain @click="showReply = true"
              >{{ com.reply_count }} 回复</van-tag
            > -->
            <van-tag plain @click="openReplyDialog(com.com_id)"
              >{{ com.reply_count }} 回复</van-tag
            >
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 =》发表对文章的评论或对某个评论回复共用一个-->
    <div class="reply-container van-hairline--top">
      <van-field
        v-model.trim="value"
        :placeholder="showReply ? '写回复' : '写评论'"
        @keyup.enter="submit"
      >
        <!-- 有赞loading组件 加载中的过渡状态。
         通过submiting避免重复提交（面试题）
         -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px">
        </van-loading>
        <!-- 具名插槽 -->
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复 弹层-->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论">
      <!-- :immediate-check="false"手动关闭list组价自动加载 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="loadReplys()"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="item in reply.list"
          :key="item.com_id"
        >
          <van-image
            round
            width="1rem"
            height="1rem"
            fit="fill"
            :src="item.aut_photo"
          />
          <div class="info">
            <p>
              <span class="name">{{ item.aut_name }}</span>
            </p>
            <p>{{ item.content }}</p>
            <p>
              <span class="time">{{ item.pubdate | relTime }}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>
<script>
import { getComments, commentOrReply } from '@/api/detail.js'
export default {
  data () {
    return {
      // 评论列表
      comments: [],
      // 评论列表加载中状态
      loading: false,
      // 评论列表完全加载完毕状态
      finished: false,
      // 输入的内容
      value: '',
      // 提交 评论或者回复 中
      submiting: false,
      // 分页偏移量
      offset: null,
      // 显示回复对话框
      showReply: false,
      // 回复相关数据
      reply: {
        loading: false,
        finished: false,
        // 回复列表 针对一个评论多个回复
        list: []
      }
    }
  },
  activated () {
    // 手动获取评论列表数据 阻止默认加载两次因为父组件已经缓存子组件也会缓存，缓存后访问的评论或回复都是第一次的数据      :immediate-check="false" 默认值是true 会出错无评论的变成了有评论且评论为第一个
    // 重置历史数据为默认
    this.comments = []
    this.finished = false
    // 开始加载评论数据
    this.loading = true
    this.offset = null
    // 重新进入机会重新渲染
    this.loadComments()
  },
  methods: {
    // 异步更新-------评论列表数据
    async loadComments () {
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.comments.push(this.comments.length + 1)
      //   }
      const { data } = await getComments({
        type: 'a',
        source: this.$route.params.id,
        offset: this.offset
      })
      console.log('评论列表：', data)
      // 追加数据
      this.comments.push(...data.results)
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (this.comments.length === data.total_count) {
        this.finished = true
      } else {
        // 准备下一页数据的请求起点 直到null
        this.offset = data.last_id
      }
      //   }, 1000)
      // }
    },
    // 写评论/回复
    async submit () {
      // 判断是否是空
      if (!this.value) return
      // 开启loading
      this.submiting = true
      try {
        if (this.showReply) {
          // 回复文章某条评论
          const { data } = await commentOrReply(this.commentId, this.value, this.$route.params.id)
          this.$toast.success('回复成功')
          // 在回复列表顶部追加一项数据 data.new_obj
          this.reply.list.unshift(data.new_obj)
          // 在当前回复的评论数据中 累加回复的数量
          const comment = this.comments.find(item => item.com_id.toString() === this.commentId)
          comment.reply_count++
          this.$toast.success('回复成功')
        } else {
          // 对文章评论
          const { data } = await commentOrReply(this.$route.params.id, this.value)
          console.log('当前新增评论数据：', data.new_obj)
          this.comments.unshift(data.new_obj)
          this.$toast.success('评论成功')
        }
        // 处理完毕
        // 关闭提交效果 ----统一
        this.submiting = false
        // 清空内容
        this.value = ''
      } catch (e) {
        this.submiting = false
        this.$toast.fail('操作失败')
      }
    },

    // 回复对话框-----评论弹层
    openReplyDialog (idcc) {
      // console.log('回复评论的id', idcc)
      // 显示回复窗口
      this.showReply = true
      // 当前评论ID存储到this上
      this.commentId = idcc
      // 清空 回复 列表
      this.reply.list = []
      // 开启加载效果
      this.reply.loading = true
      // 重置 没有更多数据
      this.reply.finished = false
      // 重置 偏移量
      this.reply.offset = null
      // 加载回复
      this.loadReplys()
    },
    // 加载回复列表
    async loadReplys () {
      const { data } = await getComments({
        type: 'c', source: this.commentId, offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      // 结束加载状态
      this.reply.loading = false
      // if (data.results.length === this.reply.list.length) {
      if (data.last_id > data.end_id) {
        this.reply.offset = data.last_id
      } else {
        this.reply.finished = true
      }
    }
  }
}

</script>
<style lang="less" scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    width: 100%;
    overflow: hidden;
    text-align: left;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
