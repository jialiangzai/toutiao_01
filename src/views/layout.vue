<template>
  <div class="container">
    <!-- 上 -->
    <van-nav-bar
      v-if="$route.path !== '/user'"
      fixed
      @click-left="$router.back()"
      right-text="搜索"
      title="首页"
      @click-right="$router.push('/search')"
    ></van-nav-bar>
    <!-- 中 -->
    <div class="my-wrapper" :class="{ noTop: $route.path === '/user' }">
      <router-view></router-view>
    </div>
    <!-- 下 -->
    <van-tabbar router v-model="active">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="search">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  // created () {
  //   console.log('获取当前页面的path路径：', this.$route.path)
  // }
  data () {
    return {
      active: 'home'
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
