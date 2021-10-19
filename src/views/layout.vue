<template>
  <div>
    <!-- 上 -->
   <van-nav-bar @click-left="$router.back()" title="首页"></van-nav-bar>
    <!-- 中 -->
    <div class="my-wrapper">
      <router-view></router-view>
    </div>
    <!-- 下 -->
    <van-tabbar router>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="search">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
</style>
