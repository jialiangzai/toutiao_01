<template>
  <div v-if="value">
    <header @click="close">弹层title</header>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  // 双向绑定：v-model 语法糖 =》 value（父传子变量） + @input（子传父事件名）
  // 说明：组件支持v-model写法
  emits: ['input'],
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 关闭弹层
    close () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
