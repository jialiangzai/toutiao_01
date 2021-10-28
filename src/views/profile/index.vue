<template>
  <div class="container">
    <div class="user-profile">
      <div class="info">
        <van-image round :src="userInfo.photo" />
        <h3 class="name">
          {{ userInfo.name }}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{ userInfo.art_count }}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{ userInfo.total_count }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{ userInfo.fans_count }}</p>
          <p>粉丝</p>
        </van-col>
      </van-row>
    </div>
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af" />我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00" />我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0" />阅读历史
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell @click="layout()" icon="warning-o" title="退出登录" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-index',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    ...mapMutations(['delToken']),
    ...mapMutations('chat', ['setPhoto']),
    // ...mapMutations('chat', ['setPhoto']),
    // 获取信息
    async getUser () {
      try {
        const { data } = await getUserInfo()
        console.log(data)
        this.userInfo = data
        // 存储头像
        this.setPhoto(data.photo)
      } catch (error) {
        console.dir(error)
        this.$toast.fail('获取用户信息失败！')
      }
    },
    // 退出
    /**
       * 确认提示===》是否退出,避免误操作
       * 调用接口 数据库+前端(删除本地token刷新页面)
       * 如果确认退出跳转到登录页
      */
    // layout () {
    //   this.$dialog.confirm({
    //     title: '提示',
    //     message: '确认退出？'
    //     // 点击确认执行then 点击取消执行catch但是点击取消会抛错
    //     // async和await 用try和catch
    //   }).then(() => console.log('退出')).catch(() => console.log('不退出'))
    // }
    async layout () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认退出？'
        })
        console.log('点击了确定')
        // 删除token vuex
        this.delToken()
        // 跳转
        this.$router.push('/login')
      } catch (error) {
        console.log('点击了取消')
      }
    }
  }

}
</script>

<style scoped lang='less'>
.user {
  &-profile {
    width: 100%;
    height: 150px;
    display: block;
    background: #ee4141;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image {
        width: 64px;
        height: 64px;
      }
      .name {
        font-size: 16px;
        font-weight: normal;
        margin-left: 10px;
      }
      .van-tag {
        background: #fff;
        color: #102424;
      }
    }
    p {
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 15px;
    text-align: left;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
  }
}
</style>
