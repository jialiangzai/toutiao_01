<template>
  <div>
    <div class="box">类名样式</div>
    <!-- 注意：行内样式不能转换 -->
    <div style="width: 20px">行内样式</div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.box {
  width: 100px;
  height: 100px;
  border: 2px solid #ddd;
  background: red;
}
</style>
