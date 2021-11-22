<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--添加角色-->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addUserDialog = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区-->
      <el-table :data="rolesList"
                border
                stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children"
                    :key="item1.id"
                    :class="[`bdbottom`,i1===0?'bdtop':'',`vcenter`]">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable
                        @close="removeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children"
                        :key="item2.id"
                        :class="[i2===0?'':'bdtop',`vcenter`]">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeTag(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children"
                            :key="item3.id"
                            type="warning"
                            closable
                            @close="removeTag(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="角色"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-tooltip class="item"
                        effect="dark"
                        content="编辑角色"
                        placement="top">
              <el-button type="primary"
                         class="el-icon-edit"
                         size="mini">编辑</el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="删除角色"
                        placement="top">
              <el-button type="danger"
                         class="el-icon-delet"
                         size="mini"
                         @click="delRole(scope.row)">删除</el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="分配角色权限"
                        placement="top">
              <el-button type="warning"
                         size="mini"
                         @click="showPowerDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色dialog窗口-->
    <el-dialog title="添加用户"
               :visible.sync="addUserDialog"
               width="50%"
               @close="addUserDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addRoleRef">
        <el-form-item label="角色名"
                      prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialig-footer">
        <el-button @click="addUserDialog = false">取消</el-button>
        <el-button type="primary"
                   @click="addRole">确认</el-button>
      </span>
    </el-dialog>
    <!--分配权限dialog窗口-->
    <el-dialog title="分配权限"
               :visible.sync="powerDialog"
               width="40%"
               @close="resetDialog">
      <el-tree :data="powerList"
               :props="treeProp"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defaultId"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="powerDialog = false">取消</el-button>
        <el-button type="primary"
                   @click="allotRights">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      powerList: [],
      treeProp: {
        children: 'children',
        label: 'authName'
      },
      defaultId: [],
      roleId: '',
      addUserDialog: false,
      powerDialog: false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名!', trigger: 'blur' },
          { min: 4, max: 10, message: '角色名为4-10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles');
      console.log(res);
      this.rolesList = res.data;
    },
    async addRole () {
      const { data: res } = await this.$axios.post('roles', this.addForm)
      if (res.meta.status !== 201) return this.$message.success(res.meta.msg)
      return this.$message.error(res.meta.msg)
    },
    addUserDialogClosed () {
      this.$refs.addRoleRef.resetFields()
    },
    async showPowerDialog (role) {
      const { data: res } = await this.$axios.get('rights/tree')
      this.getDefaultId(role, this.defaultId)
      this.roleId = role.id
      this.powerDialog = true
      if (res.meta.status !== 200) return this.$message.success(res.meta.msg)
      this.powerList = res.data
    },
    async delRole (role) {
      const { data: res } = await this.$axios.delete(`roles/${role.id}`)
      if (res.meta.status == 200) return this.$message.success(res.meta.msg)
      return this.$message.error(res.meta.msg)
    },
    async removeTag (role, id) {
      const cResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (cResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
      return this.$message.success(res.meta.msg)
    },
    //递归获取权限id
    getDefaultId (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getDefaultId(item, arr))
    },
    resetDialog () {
      this.defaultId = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`/roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.powerDialog = false
      this.getRolesList()
      return this.$message.success(res.meta.msg)
    }
  },
  created () {
    this.getRolesList();
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-button {
  margin-bottom: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>