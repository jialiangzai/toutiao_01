<template>
  <!-- 嵌套v-model会报错 子改父 -->
  <!-- <van-popup :value="value" @input="$emit('input', $event布尔值)">内容</van-popup> -->
  <!-- <van-popup v-model="value">内容</van-popup> -->
  <!-- get-container="body" -->
  <van-popup
    get-container="#app"
    :value="value"
    @input="$emit('input', $event)"
    @open="isReport = false"
  >
    <!-- 默认插槽 -->
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLiske" icon="closed-eye">不感兴趣</van-cell>
      <van-cell is-link @click="isReport = true">反馈垃圾内容</van-cell>
      <van-cell icon="info-o">拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport = false">返回</van-cell>
      <!-- 模拟字典 因为为每个cell绑定click事件请求，性能差 -->
      <van-cell
        v-for="item in reports"
        :key="item.value"
        @click="reportArt(item.label)"
        >{{ item.label }}</van-cell
      >
      <!-- <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell> -->
    </van-cell-group>
  </van-popup>
</template>
<script>
import { disLikeById, reportById } from '@/api/home.js'
import { reports } from '@/utils/const.js'
export default {
  // emits: ['input'],
  emits: ['input'],
  props: {
    // 外边v-model传值：接收必须叫value
    value: {
      type: Boolean,
      default: false
    },
    artId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 是否显示上报垃圾内容
      isReport: false,
      reports
    }
  },
  methods: {
    // 对文章不感兴趣
    async disLiske () {
      console.log('对文章不感兴趣！')
      try {
        // 发起请求捕获错误
        await disLikeById(this.artId)
        this.$toast.success('不感兴趣成功！')
        // 通知父删除不感兴趣文章 子传父
        this.$emit('del-dlike')
        // 关闭弹层
        this.$emit('input', false)
      } catch (error) {
        console.dir(error)
        this.$toast.fail('操作失败！')
      }
    },
    async reportArt (val) {
      // console.log(val)
      try {
        await reportById(this.artId, val)
        this.$toast.success('举报成功！')
        // 关闭浮层
        this.$emit('input', false)
        // 通知父组件删除当前文章
        this.$emit('del-dlike')
      } catch (e) {
        // console.log(e)
        if (e.response.status === 409) {
          return this.$toast.fail('已经举报过了！')
        }
        this.$toast.fail('举报失败！')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
