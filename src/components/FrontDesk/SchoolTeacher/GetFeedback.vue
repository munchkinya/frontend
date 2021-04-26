<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>学生实习反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="10"><!--搜索框和按钮之间的间隔-->
                <el-table :data="infoList" border stripe >
                    <!--label每一列的标题-->
                    <el-table-column type="index" label="#" width="80" align="center"></el-table-column>
                    <el-table-column prop="stunumber" label="学生学号" align="center" width="100px"></el-table-column>
                    <el-table-column prop="stuname" label="学生姓名" align="center"></el-table-column>
                    <el-table-column prop="intername" label="实习公司" align="center" width="250px"></el-table-column>
                    <el-table-column prop="old_post" label="岗位" align="center" width="200px"></el-table-column>
                    <el-table-column prop="old_post" label="薪资（RMB/月）" align="center" width="150px"></el-table-column>
                    <el-table-column prop="starttime" label="实习开始时间" align="center" :formatter="dateFormat1" width="150px"></el-table-column>
                    <el-table-column prop="endtime" label="实习结束时间" align="center" :formatter="dateFormat2" width="150px"></el-table-column>
                    <el-table-column  label="反馈" align="center" fixed="right" width="100px">
                        <template slot-scope="scope"><!--//作用域插槽-->
                            <el-button size="small" type="primary" @click="showfeedback(scope.row.feedback)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页区域-->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[1, 5, 10, 17]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="datacount">
                </el-pagination>
            </el-row>
            <el-dialog class="dialog" title="学生实习企业反馈" :visible.sync="givescoreDialogVisible" width="40%" @close="editinfoDialogClosed">
                <span>{{feedback}}</span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "GivIntershipScore",
        data(){
            return{
                inputText:'',
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认六条一页
                },
                datacount:0,//为了分页显示的时候,
                infoList:[],
                givescoreDialogVisible:false,
                radio:null,
                feedback:null,
                query:'',
                options:[],
            }
        },
        methods:{
            //表格中日期的格式化开始日期
            dateFormat1(row, column) {
                var date = new Date(row.starttime);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "-" + month + "-" + day);
            },
            //日期的格式化结束日期
            dateFormat2(row, column) {
                var date = new Date(row.endtime);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "-" + month + "-" + day);
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getStudentChangeInfo();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getStudentChangeInfo();
            },
            async getStudentIntershipScore(){
                const result = await this.$http.get('internshipinfo/getallstudentintershipinfo',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            query: this.query
                        }
                    });
                this.infoList=result.data.list
                this.datacount=result.data.total
            },
            async getStudentIntershipScoreByOthers(){
                this.queryInfo.pagenum=1
                this.queryInfo.pagesize=5
                const result = await this.$http.get('internshipinfo/getallstudentintershipinfo',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            query: this.query
                        }
                    });
                this.infoList=result.data.list
                this.datacount=result.data.total
            },
            showfeedback(feedback){
                this.feedback = feedback
                this.givescoreDialogVisible=true
            },
            editinfoDialogClosed(){
                this.radio=null
            },
            cancel(){
                this.givescoreDialogVisible=false
                this.radio=null
            },
        },
        created() {
            this.getStudentIntershipScore()
        }
    }
</script>

<style scoped>

</style>
