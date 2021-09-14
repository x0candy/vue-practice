<template>
  <div class="home">
    <!--头部-->
    <el-header class="header">
      <div>
        <img src="../../assets/logo.png"
             alt="1">
        <span>电商管理系统</span>
      </div>
      <el-button type="info"
                 @click="logOut">退出</el-button>
    </el-header>

    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button"
             @click="collapseToggle">|||</div>
        <el-menu background-color="#545c64"
                 active-text-color="skyblue"
                 text-color="#fff"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="activepath">
          <el-submenu v-for="item in menuList"
                      :key="item.order"
                      :index="item.id+''">
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item v-for="subitem in item.children"
                          :key="subitem.id"
                          :index="'/'+subitem.path"
                          @click="saveNavState('/'+subitem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--main-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <!--底部-->
    <el-footer>asdasd</el-footer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      menuIcon: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      isCollapse: false,
      activepath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  methods: {
    logOut () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error('网络错误')
      this.menuList = res.data
    },
    collapseToggle () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activepath) {
      window.sessionStorage.setItem('activepath', activepath)
    }
  }
}
</script>

<style scoped>
.home {
}
.header {
  height: 3rem;
  display: flex;
  align-items: center;
  background: #373d41;
  color: white;
  justify-content: space-between;
}
.header > div {
  display: flex;
  height: 3rem;
  align-items: center;
}
.header > div > img {
  height: 3rem;
  border-radius: 50%;
}
.el-aside {
  background-color: #545c64;
  height: 100vh;
  border-right: none;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #30373d;
  width: 100%;
  color: white;
  text-align: center;
}
</style>