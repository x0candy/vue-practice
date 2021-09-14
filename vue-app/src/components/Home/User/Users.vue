<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容"
                    v-model="queryInfo.query">
            <el-button slot="append"
                       class="el-icon-search"
                       @click="userList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border
                stripe
                :data="users">
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="用户名"
                         prop="username"></el-table-column>
        <el-table-column label="电话"
                         prop="mobile"></el-table-column>
        <el-table-column label="邮件"
                         prop="email"></el-table-column>
        <el-table-column label="权限"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态"
                         prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item"
                        effect="dark"
                        content="编辑用户"
                        placement="top">
              <el-button type="primary"
                         class="el-icon-edit"
                         size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="删除用户"
                        placement="top">
              <el-button type="danger"
                         class="el-icon-delete"
                         size="mini"
                         @click="delUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="设置用户"
                        placement="top">
              <el-button type="warning"
                         class="el-icon-setting"
                         size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryInfo.pagenum"
                       :page-sizes="[1,2,3,4]"
                       :page-size="queryInfo.pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">

        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3,
      },
      users: [],
      total: 0
    }
  },
  created () {
    this.userList()
  },
  methods: {
    async userList () {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('网络错误！')
      this.users = res.data.users
      this.total = res.data.total
    },
    async changeUserState (state) {
      const { data: res } = await this.$axios.put(`users/${state.id}/state/${state.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    async addUser (user) {
      const msg = await this.$axios.post('users', {
        username: 'monkey',
        password: '123456'
      })
      console.log(msg);
    },
    async delUser (user) {
      const msg = await this.$axios.delete(`users/${user.id}`)
      console.log(msg);
      if (msg.data.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success(msg.data.meta.msg)
    },
    //监听pagesize
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.userList()
    },
    //监听页码
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.userList()
    }
  }
}
</script>

<style>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>