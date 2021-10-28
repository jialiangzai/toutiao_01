<template>
  <div class="scroll-wrapper" @scroll="rememberPos" ref="scrollList">
    <!-- <van-cell :key="i" v-for="i in 20" title="单元格" value="内容">{{
              i
            }}</van-cell> -->
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      loosing-text="寒江孤影"
      loading-text="江湖故人"
      success-text="来活了"
      ref="refresh"
    >
      <!-- 标签一 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 新闻列表           :to="`/article/${item.art_id.toString()}`"-->
        <van-cell
          v-for="item in list"
          :key="item.art_id"
        >
          <!--一条新闻的结构-->
          <div class="article_item" @click="$router.push(`/article/${item.art_id}`)">
            <h3 class="van-ellipsis">
              {{ item.title }}
            </h3>
            <div class="img_box" v-if="item.cover.type">
              <!-- <van-image
                      class="w33"
                      fit="cover"
                      src="https://img.yzcdn.cn/vant/cat.jpeg"
                    /> -->
              <van-image
                :class="item.cover.type === 1 ? 'w100' : 'w33'"
                v-for="(img, i) in item.cover.images"
                :key="i"
                fit="cover"
                :src="img"
              >
                <template #loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
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
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <span>{{ item.pubdate | relTime }}</span>
              <!-- <span class="close"><van-icon name="cross">  </van-icon></span> -->
              <!-- 打开弹层：不感兴趣/举报等 小×-->
              <span
                v-if="$store.state.user.token"
                @click="openAction(item.art_id)"
                @click.stop="openMore(item.art_id.toString())"
                class="close"
                ><van-icon name="cross"></van-icon
              ></span>
              <!-- 父子通信 -->
              <!-- <MoreAction :value="isShow" @input="handlerPopup" /> -->
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 弹出层 v-model 是个语法糖=> :value + @input    -->
    <MoreAction v-model="isShow" @del-dlike="delDlike" :artId="artId" />
  </div>
</template>

<script>
/**
 * 记录被缓存组件滚动位置：
 * 1. 给列表绑定滚动事件=》获取滚动高度，存储到变量上
 * 2. 在切换页面后，再次回来=》通过上次记录滚动高度，获取到列表DOM对象，滚动到记录位置
 */
import MoreAction from './MoreAction.vue'
import { getArticleListApi } from '@/api/home'
export default {
  props: {
    channelId: {
      type: Number,
      default: 0
    }
  },
  components: {
    MoreAction
  },
  data () {
    return {
      list: [],

      // v-model的高级用法,列表的加载状态   =>true表示显示 false不显示 转圈或菊花
      loading: false,

      // 是否已加载完成，加载完成后不再触发load事件 加载完成ture
      finished: false,
      // 下拉刷新
      refreshing: false,
      timestamp: Date.now(),
      scrollTop: 0, // 列表滚动高度
      isShow: false, // 控制弹层是否显示
      artId: '' // 文章ID
    }
  },
  methods: {
    // 频道
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // 在onload事件中默认是开启加载状态loading
      // 下拉刷新
      await this.$seelp(2000)
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      // 每次加载的条数
      const { data } = await getArticleListApi({
        channel_id: this.channelId,
        timestamp: this.timestamp
      })
      // 追加当前分页数据
      this.list.push(...data.results)
      console.log('文章列表：', data)
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成=》判断数据是否加载完成 完成后让finished为true 不再加载数据
      // if (this.list.length >= 20) {
      //   this.finished = true
      // }
      // 数据全部加载完成=》判断数据是否加载完成
      if (!data.pre_timestamp) {
        this.finished = true
      } else {
        // 存在=》还有数据=> 把查询下一页数据的时间戳赋值给timestamp
        this.timestamp = data.pre_timestamp
      }
    },
    // 下拉刷新 向下拖拽列表手放开才会触发刷新
    onRefresh () {
      // 清空列表数据 统一处理列表的加载完成状态(重置状态，加载完了没加载完)
      this.finished = false
      // 刷新需要重置时间戳=>为当前时间!!!
      this.timestamp = Date.now()
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    // 记忆滚动
    rememberPos (e) {
      // console.log('滚动高度：', e.target.scrollTop)
      this.scrollTop = e.target.scrollTop
    },
    // 执行滚动的方法=》滚动到指定位置 articleList组件激活时=》activated钩子中执行=》滚动列表的方法
    // 根据记录滚动到上次浏览位置
    scrollList () {
      this.$refs.scrollList.scrollTop = this.scrollTop
    },
    // 删除不感兴趣文章
    delDlike () {
      // 获取要删除文章的索引值
      const index = this.list.findIndex(item => item.art_id === this.artId)
      // 执行删除
      this.list.splice(index, 1)
    },
    // 打开更多操作弹层
    /**
     * artId 当前点击操作文章ID
     */
    openAction (artId) {
      console.log(artId)
      // 把当前点击操作文章ID传给弹层
      this.artId = artId
      this.isShow = true
    },
    handlerPopup (isShow) {
      console.log('子传父：', isShow)
      this.isShow = isShow
    }
  },
  activated () {
    console.log('子组件被缓存了，再次进入')
    this.scrollList()
  },
  deactivated () {
    console.log('离开缓存的子组件组件')
  },
  created () {
    console.log('子组件创建了')
  },
  mounted () {
    console.log('$refs:', this.$refs)
  }
}
</script>

<style lang="less" scoped>
// 一条新闻的结构样式
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
