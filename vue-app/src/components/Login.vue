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
               :model="form">
        <el-form-item>
          <i class="iconfont icon-biaoqianA01_wode-35"></i>
          <el-input placeholder="用户名"
                    prefix-icon="iconfont icon-yonghuguanli"
                    v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="密码"
                    prefix-icon="iconfont icon-mimapeizhi"
                    v-model="form.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary"
                     @click="login">登陆</el-button>
          <el-button type="info">重置</el-button>
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
      }
    }
  },
  methods: {
    login: function () {   //登陆请求
      this.$axios.post('http://127.0.0.1:8888/api/private/v1/login', this.form)
        .then(res => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            })
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(Error => console.log(Error))
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