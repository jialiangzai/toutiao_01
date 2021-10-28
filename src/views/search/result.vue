<template>
  <div class="container">
    <van-nav-bar
      title="搜索结果"
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      finished-text="没有更多了"
    >
      <van-cell-group>
        <van-cell
          :to="'/article/' + item.art_id"
          v-for="(item,index) in articles"
          :key="index"
        >
          <div class="article_item">
            <h3 class="van-ellipsis">
              {{ item.title }}
            </h3>
            <div class="img_box" v-if="item.cover.type === 3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              <!-- <van-image
              class="w33"
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            /> -->
            </div>
            <div class="img_box" v-if="item.cover.type === 1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <span>{{ item.pubdate | relTime }}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/article'
export default {
  name: 'search-result',
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      // 在data声明的是响应式数据，但是还有一种形式在created 声明一个this对象点的形式他就是临时加的属性实际也不需要响应式
      querys: {
        page: 1,
        per_page: 20,
        q: this.$route.query.q
      }
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      const { status, data } = await searchArticles(this.querys)
      console.log(data)
      if (status === 200) {
        this.articles.push(...data.results)

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成  total_count太多了 这里手动设置减少内存占用
        if (data.total_count === this.articles.length) {
          this.finished = true
        } else {
          this.querys.page++
        }
      }
      // }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
