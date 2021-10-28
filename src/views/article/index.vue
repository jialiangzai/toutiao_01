<template>
  <div class="container" @scroll="remPos" ref="boxs">
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="detail">
      <h3 class="title">{{ detail.title }}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="detail.aut_photo"
        />
        <div class="text">
          <p class="name">{{ detail.aut_name }}</p>
          <p class="time">{{ detail.pubdate | relTime }}</p>
        </div>
        <!-- 关注 -->
        <van-button round size="small" type="info" @click="toggleFollow">{{
          detail.is_followed ? "已关注" : "+关注"
        }}</van-button>
      </div>
      <div class="content">
        <p class="content" v-html="detail.content"></p>
      </div>
      <!-- 用户对文章的态度 =》attitude -1: 无态度，0-不喜欢，1-点赞（喜欢）默认为0 -->
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{ active: detail.attitude === 1 }"
          plain
          icon="like-o"
          @click="toggleLike(1)"
          >点赞</van-button
        >
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          plain
          icon="delete"
          :class="{ active: detail.attitude === 0 }"
          @click="toggleLike(0)"
          >不喜欢</van-button
        >
      </div>
      <!-- 评论 -->
      <Comment />
    </div>
  </div>
</template>

<script>
import { getDetailById } from '@/api/detail'
// 关注和取关 is_followedme  默认是false
import { follow, unFollow, disLike, unDisLike, like, unLike } from '@/api/user'
import Comment from './components/comment.vue'
export default {
  name: 'articles',
  data () {
    return {
      detail: {}, // 文章详情信息
      scrollTop: 0 // 滚动位置
    }
  },
  // 之前有meta对文章缓存 组件缓存后会被执行：
  // 1. 默认第一次组件创建也会执行 2. 再次进入还会再执行
  activated () {
    // 不能盲目缓存
    // 上次访问的文章ID和下次访问的文章ID不一样
    // 但只能记录一个文章详情的
    if (this.detail.art_id !== this.$route.params.id) {
      // 新的文章重置滚动位置
      this.scrollTop = 0
      // 进入缓存的组件就会重新获取最新数据 时效性
      this.getDetail()
      /**
       * 记录用户阅读文章滚动位置=》被缓存文章（1）
       * 1. 通过scroll滚动事件存储滚动位置
       * 2. 下次再回来回到上次阅读位置
       */
    } else {
      // 执行滚动（阅读记忆）返回之前缓存的文章组件
      this.scrollTop && (this.$refs.boxs.scrollTop = this.scrollTop)
    }
  },
  // created () {
  //   this.getDetail()
  // },
  methods: {
    // 之前报错此处 原因点击跳转事件错误
    // 获取文章详情
    async getDetail () {
      const { data } = await getDetailById(this.$route.params.id)
      console.log(data)
      this.detail = data
    },
    // 阅读记忆----操作DOM
    remPos (e) {
      this.scrollTop = e.target.scrollTop
    },
    //  发起请求当dateil中的is_followed 为true表示已关注点击取关后，数据库已经取关前端也要取关 反之
    async toggleFollow () {
      try {
        if (this.detail.is_followed) {
          // 取关
          // 数据库
          await unFollow(this.detail.aut_id)
          // 前端
          this.detail.is_followed = false
        } else {
          // 关注
          // 后台数据库
          await follow(this.detail.aut_id)
          // 前端
          this.detail.is_followed = true
        }
      } catch (error) {
        // 捕获其他错误
        this.$toast.fail('操作失败')
      }
    },
    // 对文章表态：attitude -1: 无态度，0-不喜欢，1-点赞（喜欢）=> 3选1
    // type=> 1 点击了点赞按钮 0 点击了不喜欢按钮
    // 不选
    // 选了 为1喜欢可以掉接口取消添加 数据库+前端            为0不喜欢可以掉接口取消添加 数据库+前端
    // this.detail.attitude核心
    async toggleLike (type) {
      try {
        if (type === 1) {
          if (this.detail.attitude === 1) {
            // 取消/点赞 文章
            await disLike(this.detail.art_id)
            this.detail.attitude = -1
          } else {
            await unDisLike(this.detail.art_id)
            this.detail.attitude = 1
          }
        } else {
          // 写不喜欢逻辑
          if (this.detail.attitude === 0) {
            // 取消不喜欢
            await like(this.detail.art_id)
            this.detail.attitude = -1
          } else {
            // 不喜欢
            await unLike(this.detail.art_id)
            this.detail.attitude = 0
          }
        }
      } catch (error) {
        console.dir(error)
        this.$toast.fail('操作失败')
      }
    }

  },
  components: {
    Comment
  }

}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  // 内容中包含：img 特别宽  code pre 不能换行
  // height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      text-align: left;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
    /deep/ pre {
      white-space: pre-wrap;
    }
  }
}
</style>
