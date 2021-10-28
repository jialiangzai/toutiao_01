<template>
  <div class="page-user-login">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="登录"
    ></van-nav-bar>
    <!-- 子传父 -->
    <van-form @submit="onSubmit">
      <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，否则会触发表单提交。 -->
      <van-field
        v-model="form.mobile"
        name="mobile"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />
      <van-field
        v-model="form.code"
        name="code"
        label="验证码"
        placeholder="验证码"
        :rules="[
          { required: true, message: '请填写验证码' },
          { pattern, message: '请输入正确的内容' },
          //{ validator: asyncValidator, message: '请输入正确内容' }
          { validator, message: '请输入正确的验证码' },
        ]"
      >
        <!-- 通过具名插槽定制输入框右侧显示的内容 -->

        <template #button>
          <van-button size="small" native-type="button" type="#969799"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      // 技巧：变量名和后台接口需要的参数保持一致
      form: {
        // 手机号尽量不要一致 用自己的，练习的token登录人过多导致频繁过期
        mobile: '15801018678',
        code: '246810'
        // rules 定义表单校验规则 属性名和上方一致触发对象简写
      },
      pattern: /\d{6}/
    }
  },
  // created () {
  //   console.log(this.$route.query)
  // },
  methods: {
    ...mapActions(['getToken']),
    // 提交表单回调函数
    async onSubmit (values) {
      console.log('submit', values, this.form)
      /**
       * 校验通过=>登录
       * 1. 调用vuex的action发送登录请求
       * 2. 成功跳转首页
       */
      try {
        await this.getToken(values)
        // this.$toast('登录成功')
        this.$toast.success('登录成功')
        // console.log('submit', values, this.form)
        // 判断是否有参数再跳转
        // this.$router.push(this.$route.query.redirectUrk || '/')
        this.$router.push(this.$route.query.redirectUrl || '/')
      } catch (error) {
        // 必须是dir
        console.dir(error)
        // this.$toast.fail('error.response.data.message')
        this.$toast.fail(error.response.data.message)
      }
    },
    // 校验验证码函数 =》校验函数返回 true 表示校验通过，false 表示不通过
    validator (val) {
      // console.log('当前校验表单项的值：', val)
      if (val.length !== 6) return false
      return true
    }
  }
}
</script>

<style scoped lang='less'></style>
