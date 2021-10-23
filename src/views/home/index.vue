
<template>
  <div class="container">
    home
    <!-- <button @click="setToken">login</button> -->
    <!-- 文章分类栏 -->
    <!--
      swipeable 手机端支持滑动切换页签内容
      animated 开启切换时的过场动画 开启切换标签内容时的转场动画
     -->
    <van-tabs animated swipeable>
      <!-- 默认插槽 -->
      <van-tab :key="item.id" v-for="item in Channel" :title="item.name">
        <!-- 可滚动内容区域 默认插槽-->
        <div class="scroll-wrapper">
          <!-- <van-cell :key="i" v-for="i in 20" title="单元格" value="内容">{{
              i
            }}</van-cell> -->
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
            loosing-text="寒江孤影"
            loading-text="江湖故人"
            success-text="来活了"
          >
            <!-- 标签一 -->
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <!-- 新闻列表 -->
              <van-cell v-for="item in list" :key="item">
                <!--一条新闻的结构-->
                <div class="article_item">
                  <h3 class="van-ellipsis">
                    PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新
                  </h3>
                  <div class="img_box">
                    <!-- <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    /> -->
                    <van-image
                      class="w100"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    />
                    <!-- <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    /> -->
                    <!-- <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    /> -->
                  </div>
                  <div class="info_box">
                    <span>你像一阵风</span>
                    <span>8评论</span>
                    <span>10分钟前</span>
                    <span class="close"
                      ><van-icon name="cross"></van-icon
                    ></span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 右侧图标 -->
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>
<script>
// import request from '@/utils/request'
// 频道复用率低不用全局共享存储到vuex 按需
import { getChannelApi } from '../../api/home'
export default {
  name: 'home-index',
  // methods: {
  //   setToken () {
  //     this.$store.commit('setToken', { token: 23, refresh: 45 })
  //   }
  // },

  // created () {
  //   // request({ url: 'announcements' }).then(res => {
  //   // console.log('页面获取到的：', res.data)
  //   // }),
  //   request.get('user/profile').then(res => {
  //     console.log(res)
  //   })
  // }
  data () {
    return {
      // 数据列表
      list: [],

      // v-model的高级用法,列表的加载状态   =>true表示显示 false不显示 转圈或菊花
      loading: false,

      // 是否已加载完成，加载完成后不再触发load事件 加载完成ture
      finished: false,
      // 下拉刷新
      refreshing: false,
      Channel: []
    }
  },
  created () { this.getChannelApi() },
  methods: {
    // 频道
    async getChannelApi () {
      const { data } = await getChannelApi()
      console.log(data)
      this.Channel = data.channels
    },
    //   @load="onLoad"第一次默认执行一次，如果数据不够一屏还会在加载一次（防止断带）知道填满一屏
    // 第一次默认执行，加载第一页数据加载onload事件取决于是否能填充一屏，需要两次加载才为一屏
    // 用户下拉页面，滚动到底部，会在加载数据(多次触发)
    // load滚动条与底部距离小于 offset 时触发
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // 在onload事件中默认是开启加载状态loading
      setTimeout(() => {
        // 下拉刷新
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }
        // 每次加载的条数
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成=》判断数据是否加载完成 完成后让finished为true 不再加载数据
        if (this.list.length >= 20) {
          this.finished = true
        }
      }, 1000)
    },
    // 下拉刷新 向下拖拽列表手放开才会触发刷新
    onRefresh () {
      // 清空列表数据 统一处理列表的加载完成状态(重置状态，加载完了没加载完)
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }

  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  // 自定义tab样式/deep/覆盖子组件的样式
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #fc6627;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    // 控制列表区域可滚动
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20px;
  text-align: center;
  line-height: 40px;
  box-shadow: -6px -6px 8px #ddd;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
