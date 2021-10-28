<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search
      v-model="keyword"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <!-- 输入关键词的时候=》显示=》联想词列表=> 猜测用户即将要搜索的关键词结果列表 -->
    <van-cell-group class="suggest-box" v-if="keyword">
      <!-- span高亮联想关键词 -->
      <!-- 最终目标就是联想建议也可以进行跳转搜索结果 跳转要把带span标签的数据再次替换-->
      <van-cell
        icon="search"
        @click="onSearch(sug.replace(`<span>${keyword}</span>`, keyword))"
        v-for="sug in suggestList"
        :key="sug"
        ><p v-html="sug"></p
      ></van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <div class="head">
        <span>历史记录</span>
        <van-icon @click="delAllHistory" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(his, i) in historyList" :key="i">
          <a class="word_btn">{{ his }}</a>
          <van-icon
            class="close_btn"
            slot="right-icon"
            name="cross"
            @click="delHistory(i)"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 优先执行的代码 暴露的后执行
// 模拟 -----恢复数据
import { suggest } from '@/api/search'
localStorage.setItem('TT_HS', JSON.stringify(['1024', 'mi', 'honar']))
const TT_HS = 'TT_HS'
export default {
  name: 'search-index',
  data () {
    return {
      keyword: '',
      // 联想搜索
      suggestList: [],
      timer: null, // 定时器
      historyList: JSON.parse(localStorage.getItem(TT_HS)) || []
    }
  },
  methods: {
    onSearch (val) {
      /** 搜索事件回调==>手机端软键盘的回车或完成时会触发
       *历史记录 存储搜索关键词 ===> 排重
       * 跳转搜索结果也并携带当前搜索关键词
      */
      console.log(val, this.keyword)
      if (!val) return
      // New Set() 接受一个数组或类数组对象,在Set内部， NAN相等，两个对象不等，可以用length检测，可以用for...of遍历Set结构返回伪数组，用from展开或者...
      const historySet = new Set(this.historyList)
      historySet.add(val)
      this.historyList = [...historySet]
      localStorage.setItem(TT_HS, JSON.stringify(this.historyList))
      this.$router.push(`/search/result?q=${val}`)
    },

    // 删除
    delHistory (i) {
      // 1. 内存删除（软删除）
      this.historyList.splice(i, 1)
      // 2. 本地删除（硬删）
      localStorage.setItem(TT_HS, JSON.stringify(this.historyList))
    },
    // 删除全部
    delAllHistory () {
      this.historyList = []
      localStorage.setItem(TT_HS, JSON.stringify(this.historyList))
      // localStorage.removeItem(TT_HS)
    }
  },
  watch: {
    /** 用户实时输入=》会多次调用接口查找联想词列表
     * 浪费服务器资源
     * 公司成本
     * 防抖：解决高频发 ---所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
     * 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。对于节流，一般有两种方式可以实现，分别是时间戳版和定时器版
     *模拟防抖：
     * 定义一个存储定时器ID的变量
     * 在定时器规定事件内如果有重复执行就取消
     * async和await 就是最亲的兄弟 await所在的最近函数加async
     * */
    keyword () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        console.log('搜索词变化了,' + this.keyword)
        try {
          if (!this.keyword) {
            // 清空联想词列表
            this.suggestList = []
            return
          }
          // 非空
          // 搜索词

          const { data } = await suggest(this.keyword)
          console.log('联想词列表', data)
          // 小米为null
          if (data.options[0] === null) return
          // 返回数据要把包含关键词不跟使用span包裹 用map映射为包含html标签的字符串 渲染用v-html
          this.suggestList = data.options.map((word) => word.toLowerCase().replace(this.keyword, `<span>${this.keyword}</span>`))
          // es10语法 ? eslint不适用?
          // this.suggestList = data.options.map(words => { words?.tolowerCase().replace(this.keyword, `<span>${this.keyword}</span>`) })
        } catch (error) {
          console.dir(error)
        }
      }, 500)
    }
  }
}
</script>

<style scoped lang='less'>
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    text-align: left;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
</style>
