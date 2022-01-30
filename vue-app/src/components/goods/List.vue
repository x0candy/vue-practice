<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20" class="search_input">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" class="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表 -->
            <el-table :data="goods" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" 
                        size="mini" 
                        icon="el-icon-delete" 
                        @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5,10,15,20]"
            :page-size="queryInfo.pagesize" 
            @current-change="handleCurrentChange" 
            :total="total" 
            layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </el-card>
    </div>    
</template>

<script>
export default {
    data(){
        return{
            // 查询参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goods:[],
            total:0
        }
    },
    methods:{
        async getGoodsList(){
            const {data:res} = await this.$axios.get('goods',{
                params:this.queryInfo
            })
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.goods = res.data.goods
            this.total = res.data.total
            console.log(res);
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize
            this.getGoodsList()
        },
        handleCurrentChange(newpagenum){
            this.queryInfo.pagenum = newpagenum
            this.getGoodsList()
        },
        removeById(id){
            this.$confirm('此操作将永久删除该选项，是否继续？','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                const res = this.$axios.delete(`goods/${id}`)
                return res
            }).then(res=>{
                console.log(res);
                console.log(res.data.meta.status);
                if(res.data.meta.status!==200) return this.$message.error(res.data.meta.msg)
                return this.$message.success(res.data.meta.msg)
            }).catch(()=>{
                return this.$message.info('已取消删除')
            })
        },
        goAddpage(){
            this.$router.push('/goods/add')
        }
    },
    created(){
        this.getGoodsList()
    }
}
</script>

<style scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
.search_input{
    margin-bottom: 15px;
}
.el-pagination{
    margin-top: 15px;
}
</style>