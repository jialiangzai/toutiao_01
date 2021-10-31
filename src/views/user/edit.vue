<template>
  <!-- 因为是一级路由和公共部分不同无底层标签栏 -->
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save"
    />
    <!-- 用户资料 -->
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto = true" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="photo"
        />
      </van-cell>
      <van-cell
        is-link
        title="名称"
        @click="showName = true"
        :value="user.name"
      />
      <van-cell
        is-link
        title="性别"
        @click="showGender = true"
        :value="user.gender === 0 ? '男' : '女'"
      />
      <van-cell
        is-link
        title="生日"
        @click="openDate()"
        :value="user.birthday"
      />
    </van-cell-group>
    <!-- 资料修改  通过弹出层-->
    <van-popup v-model="showPhoto" position="bottom">
      <!-- 选择文件，但是不显示 -->
      <!-- <van-cell value="本地相册选择" is-link /> -->
      <input
        type="file"
        @change="preview"
        ref="selPhoto"
        style="display: none"
      />
      <van-cell @click="$refs.selPhoto.click()" value="本地相册选择" is-link />
      <!-- 选择文件，但是不显示 -->
      <!-- <input
        type="file"
        @change="preview"
        ref="selPhoto"
        style="display: none"
      />
      <van-cell @click="$refs.selPhoto.click()" value="本地相册选择" is-link /> -->
      <van-cell value="拍照" is-link />
    </van-popup>
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" @click="changeGender(0)" is-link />
      <van-cell value="女" @click="changeGender(1)" is-link />
    </van-popup>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        title="选择生日"
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday = false"
        @confirm="confirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile0, updateUserPhoto, updateUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-profile',
  data () {
    return {
      // 弹窗控制
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthday: false,
      // 当前选中日期
      nowDate: new Date(),
      // 最小可选日期
      minDate: new Date('1950-01-01'),
      // 日期控件 最大可选日期
      maxDate: new Date(),
      // 默认用户信息
      photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
      user: {
        name: '默认信息',
        gender: 0,
        birthday: '2019-10-10'
      }
    }
  },
  methods: {

    ...mapMutations('chat', ['setPhoto']),
    // 保存图片---上传到数据库
    async save () {
      // this.$toast.success('保存成功')
      // 注意这里控制台会报错 避免报错用es10问号截断报错
      console.log(('保存头像', this.$refs.selPhoto, this.$refs.selPhoto?.files[0]))
      try {
        if (this.$refs.selPhoto && this.$refs.selPhoto.files[0]) {
          const res = await updateUserPhoto(this.$refs.selPhoto.files[0])
          console.log(res)
          // 更新用户信息
          await updateUserInfo(this.user)
          this.$toast.success('保存成功！')
        }
      } catch (error) {
        this.$toast.fail('保存失败！')
      }
    },
    // methods
    // 打开日期选择
    openDate () {
      // 有生日数据
      if (this.user.birthday) {
        //   数据回显
        this.nowDate = new Date(this.user.birthday)
      }
      this.showBirthday = true
    },
    // 确认选择日期
    confirmDate (value) {
      // 确认时间后  把Date转换成String
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    // 性别
    changeGender (gender) {
      // 选择性别 gender 0 男  1 女
      this.user.gender = gender
      this.showGender = false
    },
    created () {
      this.getInfo()
    },
    // 获取待编辑信息（登录人）
    async getInfo () {
      try {
        const { data } = await getUserProfile0()
        console.log(data)
        this.user = data
        this.photo = data.photo
      } catch (error) {
        console.log('获取编辑信息失败')
      }
    },
    // 本地上传头像 ----图片预览
    preview (e) {
      console.log('选择的图片dom和文件：', e.target, this.$refs.selPhoto.files[0])
      // 把file对象转换成img可以渲染格式
      // 1. 创建文件读取实例
      const fileReader = new FileReader()
      // 2. 读取file对象数据=》传入读取的file对象=》异步
      fileReader.readAsDataURL(e.target.files[0])
      // 3. 通过onload回调获取读取结果=》base64格式
      fileReader.onload = () => {
        console.log('读取结果：', fileReader.result)
        this.photo = fileReader.result
        this.showPhoto = false
      }
    }
  }

}
</script>

<style scoped lang='less'></style>
