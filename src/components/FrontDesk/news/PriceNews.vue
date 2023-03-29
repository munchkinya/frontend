<template>
    <div class="recruitnews">
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>就业信息</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>实习相关信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="newslist">
            <el-table :data="newsList" :show-header="false" :cell-style="changestyle" @row-click="handle"
                      style="margin-top: 0">
              <el-table-column>
                <template slot-scope='scope'>
                  <el-link target='_blank' :underline="false">{{scope.row.title}}</el-link>
                </template>
              </el-table-column>
                <el-table-column prop="publishtime" width="150px" :formatter="dateFormat1"></el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 6, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PriceNews",
        data(){
            return{
                newsList:[],
                total:0,//所有用户数据总量
                queryInfo:{
                    pagenum:1,//默认从第一页
                    pagesize:6//默认五条一页
                },
            }
        },
        methods:{
            dateFormat1(row, column) {
                var date = new Date(row.publishtime);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "年" + month + "月" + day+"日");
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getNewList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getNewList();
            },
            async getNewList(){
                const result=await this.$http.get('news/getallpriceNews',
                    {
                        params: {
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                this.newsList=result.data.list;
                this.total=result.data.total
            },
            handle(row, column, event){
                this.$router.push({name: "tonewdetil", params: {id: row.notice_id}})
            },
            changestyle({row, rowIndex}){
                return "border:none !important;background-color:#FFFFFF;"
            }
        },
        created() {
            this.getNewList()
        }
    }
</script>

<style lang="less" scoped>
.recruitnews{
    background-color: #FFFFFF;
    color: #333;
    text-align: center;
    line-height: 160px;
    .newslist{
        border: 2px solid #9A0102;
        border-width: 2px 0 0 0;
        /*padding-top: 10px;*/
    }
}
    .el-table td, .el-table th.is-leaf{
        border:none !important;
    }
</style>
