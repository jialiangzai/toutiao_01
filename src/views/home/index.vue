
<template>
  <div class="container">
    <!-- <Modal v-model="isShowModal"> -->
    <!-- <Modal :value="isShowModal" @input="isShowModal = $event"> $event默认是形参 简写了-->
    <!-- <h1>我是弹层内容</h1> -->
    <!-- <div>内容2</div> -->
    <!-- <van-button native-type="button" type="primary">确定</van-button> -->
    <!-- </Modal> -->
    <!-- <button @click="isShowModal = !isShowModal">控制modal是否显示</button> -->
    <!-- <button @click="setToken">login</button> -->
    <!-- 文章分类栏 -->
    <!--
      swipeable 手机端支持滑动切换页签内容
      animated 开启切换时的过场动画 开启切换标签内容时的转场动画
     -->
    <van-tabs animated swipeable v-model="activeIndex">
      <!-- 默认插槽 -->
      <van-tab :key="item.id" v-for="item in Channel" :title="item.name">
        <!-- 可滚动内容区域 默认插槽-->
        <ArticleList :channelId="item.id" />
      </van-tab>
    </van-tabs>
    <!-- 右侧图标 -->
    <span class="bar_btn" @click="isShows = true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 不要嵌套 -->
    <!-- 通过双向绑定控制显示或隐藏 -->

    <!--
      .sync 同步修改数据
      用法：
      1. 传入变量 => :属性名.sync="变量"(简化写法)
      2. 修改变量 =>  this.$emit('update:属性名',data)
      注意：vue3不在支持
     -->
    <ChannelEdit
      v-model="isShows"
      :myChannel="Channel"
      :activeIndex.sync="activeIndex"
    />
    <!-- <ChannelEdit
      v-model="isShows"
      :myChannel="Channel"
      :activeIndex="activeIndex"
      @enter-channel="activeIndex = $event"
    /> -->
  </div>
</template>
<script>
// import request from '@/utils/request'
// import { getChannelApi } from '@/api/channel'
import { getUserChannelApi } from '../../api/channel'
import ArticleList from './components/articleList.vue'
import ChannelEdit from './components/channel_edit.vue'
// 频道复用率低不用全局共享存储到vuex 按需
export default {
  name: 'home-index',
  // 如果缓存了就会执行
  // 默认会执行一次
  // 被缓存后，离开再次进入
  // activated () {
  //   console.log('被缓存了，再次进入')
  // },
  // deactivated () {
  //   console.log('离开缓存的组件')
  // },

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
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      // 当前用户（我的频道）数据
      Channel: [],
      // 控制频道编辑弹出层显示隐藏的
      isShowModal: false,
      isShows: false,
      // 当前选中页签的索引值
      activeIndex: 0
    }
  },
  created () {
    // 频道
    this.getChannel()
    // console.log('创建了父组件')
    // 测试refresh_token
    // request.get('user/profile').then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    //   @load="onLoad"第一次默认执行一次，如果数据不够一屏还会在加载一次（防止断带）知道填满一屏
    // 第一次默认执行，加载第一页数据加载onload事件取决于是否能填充一屏，需要两次加载才为一屏
    // 用户下拉页面，滚动到底部，会在加载数据(多次触发)
    // load滚动条与底部距离小于 offset 时触发
    async getChannel () {
      const { data } = await getUserChannelApi()
      console.log(data)
      this.Channel = data.channels
    }

  }
}
</script>

<style scoped lang='less'>
// 覆盖有赞页签组件的默认样式
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  // 自定义tab样式=》/deep/覆盖子组件的样式
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
</style>
