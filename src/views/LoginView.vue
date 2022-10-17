<template>
  <div class="container">
    <div class="title">用户登录</div>
    <el-form :model="form" :rules="rules" ref="loginFormRef">
      <el-form-item label="账号" prop="phone">
        <el-input
          placeholder="请输入手机号"
          prefix-icon="el-icon-user-solid"
          v-model.number="form.phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请输入密码"
          prefix-icon="el-icon-s-goods"
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="this.onSubmit">登录</el-button>
        <el-button @click="this.onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应为6-20', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        this.form.password = this.$md5(this.form.password)
        console.log(this.form)
        const { data: res } = await this.$http.post('/login', this.form)
        if (res === 'PHONE_ERROR') {
          this.$message({
            message: '账号错误，请重试！',
            type: 'error'
          })
          this.form.phone = ''
          this.form.password = ''
        } else if (res === 'PASSWORD_ERROR') {
          this.$message({
            message: '密码错误，请重试！',
            type: 'error'
          })
          this.form.password = ''
        } else if (res === 'user' || res === 'scanner') {
          this.$message({
            message: '非管理员账号',
            type: 'error'
          })
          this.form.phone = ''
          this.form.password = ''
        } else {
          this.$message({
            message: '登录成功！',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res)
          window.sessionStorage.setItem('phone', this.form.phone)
          this.$router.push('/user')
        }
      })
    },
    onReset () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #f0f8ff;
  width: 300px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  border-radius: 20px;
}
.title {
  font-size: x-large;
  margin-bottom: 20px;
}
</style>
