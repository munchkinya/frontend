<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>新闻管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>新闻维护</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-col :span="4" :offset="21">
                <el-button type="danger" @click="toaddNews">添加新闻</el-button>
            </el-col>
            <!--角色列表区-->
            <el-table :data="newsList" :default-sort = "{prop: 'publishtime', order: 'descending'}">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="新闻标题" prop="title" show-overflow-tooltip width="300px"
                                 @cell-click="handle"></el-table-column>
                <el-table-column label="发布时间" prop="publishtime" sortable width="150px" :formatter="dateFormat1"></el-table-column>
                <el-table-column label="类别" prop="kind" width="150px">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-tag type="success" v-if="scope.row.kind==='student'">{{'学校相关新闻'}}</el-tag>
                        <el-tag type="warning" v-if="scope.row.kind==='potice'">{{'实训相关新闻'}}</el-tag>
                        <el-tag v-if="scope.row.kind==='price'">{{'实习相关新闻'}}</el-tag>
                        <el-tag type="danger" v-if="scope.row.kind==='inter'">{{'招聘相关新闻'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发布人" prop="publisher" width="150px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="是否轮播" prop="isslideshow" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isslideshow===0">不轮播</span>
                        <span v-if="scope.row.isslideshow===1">轮播</span>
                    </template>
                </el-table-column>
                <el-table-column label="浏览量" prop="pageview" width="70px"></el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.notice_id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteNew(scope.row.notice_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "New",
        data() {
            return {
                newsList:[],
                total:0,//所有用户数据总量
                queryInfo:{
                    pagenum:1,//默认从第一页
                    pagesize:5//默认五条一页
                },
            }
        },
        methods: {
            async getList(){
                const result=await this.$http.get('news/getAllNews',
                    {
                        params: {
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取新闻列表失败！');
                //如果没有return，说明获取成功了，那就保存导data中
                this.newsList = result.data.list;
                this.total = result.data.total;
            },
            async getListothers(){
                this.queryInfo.pagenum=1
                this.queryInfo.pagesize=5
                const result=await this.$http.get('news/getAllNews',
                    {
                        params: {
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取新闻列表失败！');
                //如果没有return，说明获取成功了，那就保存导data中
                this.newsList = result.data.list;
                this.total = result.data.total;
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getList();
            },
            //跳转详情页面
            handle(row, column, cell, event) {
                this.$router.push({name: "newdetail", params: {id: row.notice_id}})
            },
            //跳转编辑页面
            showEditDialog(id){
                this.$router.push({name: "editnews", params: {id: id}})
            },
            //跳转添加新闻页面
            toaddNews(){
                this.$router.push({name: "addnews"})
            },
            //表格中日期的格式化开始日期
            dateFormat1(row, column) {
                var date = new Date(row.publishtime);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "-" + month + "-" + day);
            },
            //删除新闻
            deleteNew(id){
                var that=this
                this.$confirm('此操作将永久删除该新闻，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let result=that.$http.get('/news/deletenew', {
                        params:{
                            notice_id:id
                        }
                    });
                    that.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    that.getListothers()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }

        },
        created() {
            this.getList();
        }
    }
</script>

<style lang="less" scoped>
    .el-table{
        border: 1px solid #eeeeee;
        border-width: 2px 0 0 0;
    }
    .el-button{
        margin-bottom: 20px;
    }

</style>
