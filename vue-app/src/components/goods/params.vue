<template>
  <div>
    <el-breadcrumb separator-class="el-icon-awwor-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                :closable="false"
                show-icon></el-alert>
      选择商品分类：<el-cascader v-model="selectedKeys"
                   :options="CateList"
                   :props="cascaderProps"
                   @change="cateChanged"
                   style="width:30%"></el-cascader>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisable"
                     @click="dialogVisible = true">添加参数</el-button>
          <el-table :data="manyTable"
                    border
                    stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(scope.row,i)">{{item}}</el-tag>
                <el-input v-if="scope.row.inputVisible==true"
                          v-model="scope.row.inputValue"
                          class="input-new-tag"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          size="small"
                          @blur="handleInputConfirm(scope.row)"
                          ref="saveTagInput"></el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="delAttrs(scope.row)"
                           size="mini">删除</el-button>
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisable"
                     @click="dialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTable"
                    border
                    stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable>{{item}}</el-tag>
                <el-input v-if="scope.row.inputVisible==true"
                          v-model="scope.row.inputValue"
                          class="input-new-tag"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          size="small"
                          @blur="handleInputConfirm(scope.row)"
                          ref="saveTagInput"></el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="delAttrs(scope.row)"
                           size="mini">删除</el-button>
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="'添加'+titleText"
               :visible.sync="dialogVisible"
               @close="resetDialog">
      <el-form :model="addAttr"
               ref="addAttrRef"
               :rules="addAttrRules"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addAttr.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer"
            slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addAttrs">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改'+titleText"
               :visible.sync="editDialogVisible">
      <el-form :model="addAttr"
               ref="addAttrRef"
               :rules="addAttrRules"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addAttr.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="editAttrs">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        emitPath: false
      },
      selectedKeys: 0,
      CateList: [],
      activeName: 'many',
      onlyTable: [],
      manyTable: [],
      dialogVisible: false,
      addAttr: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      editAttr: {}
      ,
      addAttrRules: {
        attr_name: [{
          required: true, message: "请输入内容！", trigger: 'blur'
        }]
      },
      editDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      this.CateList = res.data
    },
    cateChanged () {
      this.getParams()
    },
    handleClick () {
      this.getParams()
    },
    async getParams () {
      const { data: res } = await this.$axios.get(`categories/${this.selectedKeys}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (this.activeName === 'many') {
        this.manyTable = res.data
        this.manyTable.forEach(item => {
          item.attr_vals = item.attr_vals ?
            item.attr_vals.split(' ') : []
          this.$set(item, "inputVisible", 'false')
          this.$set(item, "inputValue", "")
        })
      } else {
        this.onlyTable = res.data
      }
      console.log(this.manyTable);
    },
    addAttrs () {
      this.$refs.addAttrRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post(`categories/${this.selectedKeys}/attributes`, {
            attr_name: this.addAttr.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.addAttr.attr_vals
          })
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.getParams()
          this.dialogVisible = false
          return this.$message.success(res.meta.msg)
        }
      })
    },
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get(`categories/${this.selectedKeys}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editAttr = res.data
    },
    editAttrs () {
      this.$refs.addAttrRef.validate(async valid => {
        if (valid) {
          console.log(this.editAttr);
          const { data: res } = await this.$axios.put(`categories/${this.selectedKeys}/attributes/${this.editAttr.attr_id}`, {
            attr_name: this.addAttr.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.addAttr.attr_vals
          })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getParams()
          this.editDialogVisible = false
          return this.$message.success(res.meta.msg)
        }
      })
    },
    async delAttrs (attr) {
      const { data: res } = await this.$axios.delete(`categories/${this.selectedKeys}/attributes/${attr.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error("删除失败！")
      this.getParams()
      return this.$message.success(res.meta.msg)
    },
    resetDialog () {
      this.$refs.addAttrRef.resetFields()
    },
    async handleInputConfirm (item) {
      if (item.inputValue.trim().length === 0) {
        item.inputValue = ''
        item.inputVisible = false
        return
      }
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      item.inputVisible = false
      const { data: res } = await this.$axios.put(`categories/${this.selectedKeys}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: item.attr_sel,
        attr_vals: item.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    showInput (item) {
      item.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleClose (item, index) {
      item.attr_vals.splice(index, 1)
      const { data: res } = await this.$axios.put(`categories/${this.selectedKeys}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: item.attr_sel,
        attr_vals: item.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    isBtnDisable () {
      if (this.selectedKeys == 0) {
        return true
      }
    },
    titleText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-alert {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>