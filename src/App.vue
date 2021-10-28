<template>
  <div id="app">
    <!-- <div class="text"> -->
    <!-- Skeleton 骨架屏 -->
    <!-- 通过 avatar 属性显示头像     占位 -->
    <!-- props 父传子  avatar ===> :avatar:true-->
    <!-- <van-nav-bar
        title="首页"
        left-text="返回"
        right-text="按钮"
        left-arrow/>
      <van-skeleton title avatar :row="3" />
      <van-button type="primary">主要按钮</van-button>
      <van-button type="info">信息按钮</van-button>
      <van-button type="default">默认按钮</van-button>
      <van-button type="warning">警告按钮</van-button>
      <van-button type="danger">危险按钮</van-button> -->
    <!-- </div> -->
    <!-- <router-view /> -->
    <!--  -->
    <!-- 如果配置 isKeepAlive渲染缓存 -->
    <keep-alive>
    <router-view v-if="$route.meta.isKeepAlive"></router-view>
    </keep-alive>
    <!-- 没有配置isKeepAlive 渲染不会被缓存 -->
     <router-view v-if="!$route.meta.isKeepAlive"></router-view>
    <!-- <VanChild /> -->
  </div>
</template>
<script>
// import VanChild from './components/child.vue'
export default {
  // components: {
  //   // VanChild
  // }
}
</script>

<style lang="less">
</style>
