<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class="treeTable"
                  :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  border
                  :show-row-hover="true">
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted===false"
             style="color:lightgreen;"></i>
          <i class="el-icon-error"
             v-else
             style="color:red;"></i>
        </template>
        <template slot-scope="scope"
                  slot="sort">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1"
                  type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2"
                  type="warning">三级</el-tag>
        </template>
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <div>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryInfo.pagenum"
                       :page-sizes="[3,4,5,6]"
                       :page-size="queryInfo.pagesize"
                       layout="total,sizes,prev,pager,next,jumper"
                       :total="total"></el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加分类"
               :visible.sync="addCateVisible"
               @close="resetAddDialog">
      <el-form :model="addCateForm"
               label-width="100px"
               :rules="addCateRules"
               ref="addCateRef">
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader v-model="selectedKeys"
                       :options="parentCateList"
                       :props="cascaderProps"
                       @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addCate">确认</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addCateVisible: false,
      cateList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedKeys: [],
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: "是否有效",
        type: 'template',
        template: 'isok'
      }, {
        label: "排序",
        type: 'template',
        template: 'sort'
      }, {
        label: "操作",
        type: 'template',
        template: 'opt'
      }],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      }
    }
  },
  created () { this.getCateList() },
  methods: {
    //监听器
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    async getCateList () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    addCateDialog () {
      this.getParentCateList()
      this.addCateVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error("获取父级分类失败")
      this.parentCateList = res.data
    },
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    addCate () {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getCateList()
        this.addCateVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    async deleteCate (cate) {
      const { data: res } = await this.$axios.delete(`categories/${cate.cat_id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getCateList()
      return this.$message.success(res.meta.msg)
    },
    resetAddDialog () {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style scoped>
.treeTable {
  margin-bottom: 15px;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>