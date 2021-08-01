<template>
  <div class="login">
    <div class="login-form">
      <el-form ref="formData"
               :model="formData"
               label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formData.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.passWorld"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      formData: {
        userName: '',
        passWorld: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  background-color: rgb(31, 236, 185);
  height: 100%;
}
.login-form {
  width: 20%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate();
}
</style>
