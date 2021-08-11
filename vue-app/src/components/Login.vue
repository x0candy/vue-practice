<template>
  <div class="login-container">
    <div class="login-box">
      <!--头像区域-->
      <div class="avatar-box">
        <img src="../assets/logo.png"
             alt="头像">
      </div>
      <!--登陆表单-->
      <el-form class="login-form"
               :model="form"
               :rules="rules"
               ref="loginFormRef">
        <el-form-item prop="username">
          <i class="iconfont icon-biaoqianA01_wode-35"></i>
          <el-input placeholder="用户名"
                    prefix-icon="iconfont icon-yonghuguanli"
                    v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="密码"
                    prefix-icon="iconfont icon-mimapeizhi"
                    v-model="form.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary"
                     @click="login">登陆</el-button>
          <el-button type="info"
                     @click="reset('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      form: { //用户名与密码
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名不符合规范！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { min: 3, max: 10, message: '密码不符合规范！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login: function () {   //登陆请求
      this.$refs['loginFormRef'].validate(valid => {//表单校验
        if (valid) {
          this.$axios.post('http://127.0.0.1:8888/api/private/v1/login', this.form)
            .then(res => {
              console.log(res)
              if (res.data.meta.status == 200) {
                const token = res.data.data.token
                window.sessionStorage.setItem('token', token)
                this.$router.push('/home')
                this.$message({
                  message: res.data.meta.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(Error => console.log(Error))
        } else {
          this.$message.error('用户名或密码格式不正确！')
        }
      })
    },
    reset: function (formName) {
      this.$refs[formName].resetFields()
    }
  },
}
</script>

<style scoped>
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 20px;
}
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  width: 28.125rem;
  height: 18.75rem;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar-box {
  width: 8.125rem;
  height: 8.125rem;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login-btn {
  float: right;
}
</style>