<template>
  <!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->

  <van-action-sheet
    :value="value"
    @closed="editing = false"
    @input="$emit('input', $event)"
    title="编辑频道"
    position="top"
  >
    <!-- 我的频道 -->
    <div class="channel">
      <!-- 操作区域 -->
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button
          v-if="!editing"
          @click="editing = true"
          size="mini"
          type="info"
          plain
          >编辑</van-button
        >
        <van-button
          v-else
          @click="editing = false"
          size="mini"
          type="danger"
          plain
          >完成</van-button
        >
      </div>
      <van-grid class="van-hairline--left">
        <!-- 渲染我的频道 -->
        <van-grid-item v-for="(item, i) in myChannel" :key="item.id">
          <span
            @click="enterChannel(i)"
            class="f12"
            :class="{ red: activeIndex === i }"
            >{{ item.name }}
          </span>
          <!-- <van-icon v-show="editing" class="btn" name="cross"></van-icon> -->
          <!-- 删除按钮 首页推荐不可删除 索引为0 -->
          <van-icon
            @click="delChannel(item.id, i)"
            v-show="editing && i !== 0"
            class="btn"
            name="cross"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <!-- 渲染可选频道 -->
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <!-- <van-grid-item v-for="index in 8" :key="index">
          <span class="f12">频道{{ index }}</span> -->
        <van-grid-item v-for="item in optionsChannel" :key="item.id">
          <span class="f12">{{ item.name }}</span>
          <!-- 添加我的频道 分析接口文档，处理后台接口需要的数据=》 现有我的频道数据+新增频道-->
          <!-- - 后台需要排序  [{id:'频道ID',seq:'排序'}] 必须 本地需要 {id:'频道ID',name:'频道名称'} -->
          <van-icon
            @click="addChannel(item)"
            class="btn"
            name="plus"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>
<script>
import { getChannelApi, delChannel, addChannelApi } from '@/api/channel'
export default {
  props: {
    // 打开/关闭的状态
    value: {
      type: Boolean,
      default: false
    },
    // 我的频道数据
    myChannel: {
      type: Array,
      default: () => []
    },
    // 当前选中页签索引值
    activeIndex: {
      type: Number,
      default: 0

    }
  },

  data () {
    return {
      // 编辑状态
      editing: false,
      // 所有频道
      allChannel: []
    }
  },
  /**
   * 可选频道数据（选剩下的） = 所有频道数据 - 我的频道数据
   */
  computed: {
    // 可选频道
    optionsChannel () {
      // 可选频道（计算属性） = 全部频道 - 我的频道
      // 减法逻辑：
      // 1. 先遍历全部频道，拿着当前遍历的频道的ID，去我的频道中查找有没有相同ID的频道
      // 2. 查到了相同的频道ID  排除不要
      // 3. 查询不到频道的ID  这就是可选频道  追加到新数组中即可
      // Array.filter() 根据原有的数组，进行遍历，根据条件（回调函数返回值true|false）追加选项到新数组中。
      return this.allChannel.filter(all => {
        // 如果当前遍历的all在myChannel里存在就不要！
        return !this.myChannel.some(my => my.id === all.id)
        // return this.myChannel.findIndex(my => my.id === all.id) === -1
      })
    }
  },
  created () {
    this.getChannel()
  },
  methods: {
    // 添加
    /**
       * 后端需要的数据：[{id:频道ID, seq:索引值}]=》我的频道数据+当前新增频道
       * 1. 处理我的频道myChannel数据格式
       * 2. 把新增的加到处理完的我的频道数据中，保持一样的格式
       * 3. 删除推荐数据
       */
    async addChannel (channel) {
      console.log(channel)
      // 数组的map遍历数组 返回新数组map的回调函数中支持return返回值；return的是啥，相当于把数组中的这一项变为啥（并不影响原来的数组，只是相当于把原数组克隆一份，把克隆的这一份的数组中的对应项改变了）； seq:顺序序号表示去考试座号
      const data = this.myChannel.map((item, i) => {
        // 处理我的频道myChannel数据格式
        return { id: item.id, seq: i }
      })
      data.push({ id: channel.id, seq: data.length })
      // 去掉第一个
      data.shift()
      console.log('处理完数据结构：', data)
      // 调用接口新增我的频道...
      try {
        await addChannelApi(data)
        this.$toast.success('新增成功')
        this.myChannel.push(channel)
      } catch (error) {
        this.$toast.fail('新增失败')
      }
    },
    async getChannel () {
      const { data } = await getChannelApi()
      this.allChannel = data.channels
    },
    // 点击进入某个频道
    // index 当前进入频道索引值
    enterChannel (index) {
      // 1. 进入
      // this.$emit('enter-channel', index)
      this.$emit('update:activeIndex', index)

      // 2. 关闭弹层
      this.$emit('input', false)
    },
    // 删除我的频道
    /**
     * id 频道ID
     * i 频道索引值
     */
    async delChannel (id, i) {
      try {
        console.log(id, i)
        /**
         * 1. 调用接口删除（数据库删除）
         * 2. 成功提示
         * 3. 前端删除
         */
        await delChannel(id)
        this.$toast.success('删除成功')
        /**
         * 如果删除选中频道之前的频道，选中出问题
         * 解决：当前选中频道索引值减一=》向前进一步
         */
        if (i < this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        this.myChannel.splice(i, 1)
      } catch (error) {
        console.dir(error)
        this.$toast.success('删除失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
// 去圆角（注意修改van-popup--方向）
.van-popup--top {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #fc6627;
    color: #fff;
    .van-icon-close,
    .van-action-sheet__close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    text-align: left;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
