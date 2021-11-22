<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table border
                stripe
                :data="powerList">
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="权限名称"
                         prop="authName">
        </el-table-column>
        <el-table-column label="路径"
                         prop="path">
        </el-table-column>
        <el-table-column label="权限等级"
                         prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success"
                    v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning"
                    v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      powerList: []
    }
  },
  methods: {
    async getPowerList () {
      const { data: res } = await this.$axios.get('rights/list');
      this.powerList = res.data;
      console.log(res);
    }
  },
  created () {
    this.getPowerList();
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>