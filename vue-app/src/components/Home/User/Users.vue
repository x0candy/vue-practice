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
                     @click="addDialogVisible = true">添加用户</el-button>
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
        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-tooltip class="item"
                        effect="dark"
                        content="编辑用户"
                        placement="top">
              <el-button type="primary"
                         class="el-icon-edit"
                         size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
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
                        content="分配角色"
                        placement="top">
              <el-button type="warning"
                         class="el-icon-setting"
                         size="mini"
                         @click="setRoleDialog(scope.row)"></el-button>
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
    <!--添加用户对话框-->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addUserForm"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认取消按钮 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addUser">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户信息"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editForm"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="email">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="editUser">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色"
               :visible.sync="setDialogVisible"
               @close="resetDialog">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId">
            <el-option v-for="item in roleList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setDialogVisible=false">取消</el-button>
        <el-button type="primary"
                   @click="setRole">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    //校验邮箱
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法的邮箱"))
    }
    //校验手机号
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法的手机号"))
    }
    return {
      selectedRoleId: '',
      //需要分配角色的用户信息
      userInfo: {},
      //角色列表
      roleList: [],
      //查询列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3,
      },
      //添加用户列表
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //编辑用户列表
      editForm: {},
      //用户列表
      users: [],
      //用户总数
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      setDialogVisible: false,
      //表单校验
      addFormRules: {
        username: [
          { required: true, message: '请设置用户名！', trigger: 'blur' },
          { min: 5, max: 10, message: '用户名长度为6-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请设置密码!', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度为6-15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请填写email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.userList()
  },
  methods: {
    //获取用户列表
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
    async delUser (user) {
      const msg = await this.$axios.delete(`users/${user.id}`)
      if (msg.data.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success(msg.data.meta.msg)
      this.userList()
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
    },
    //重置addDialog
    addDialogClosed () {
      this.$refs.addUserForm.resetFields()
    },
    //表单校验
    addUser () {
      this.$refs.addUserForm.validate(async valid => {
        //校验未通过
        if (!valid) return
        //校验通过,发起http请求
        const { data: res } = await this.$axios.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
      })
    },
    //编辑用户的dialog
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get('users/' + id)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editForm.resetFields()
    },
    //编辑用户
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
    },
    async setRoleDialog (user) {
      this.userInfo = user
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
      this.setDialogVisible = true
    },
    async setRole () {
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.setDialogVisible = false
      this.userList()
      return this.$message.success(res.meta.msg)
    },
    resetDialog () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>