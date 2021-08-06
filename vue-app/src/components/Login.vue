<template>
  <div class="login-container">
    <div class="login-box">
      <!--头像区域-->
      <div class="avatar-box">
        <img src="../assets/logo.png"
             alt="头像">
      </div>
      <!--登陆表单-->
      <el-form>
        <el-form-item>
          <el-input placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登陆</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
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
</style>