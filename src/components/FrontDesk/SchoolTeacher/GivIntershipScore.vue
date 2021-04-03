<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>学生实习成绩</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="10"><!--搜索框和按钮之间的间隔-->
                <el-col :span="6" style="margin-left: 30px;margin-bottom: 30px">
                    <el-input
                            placeholder="请输入学生姓名"
                            v-model="inputText"
                            clearable>
                    </el-input>
                </el-col>
                <el-col :span="6" style="margin-left: 30px">
                    <el-button type="primary" @click="getStudentIntershipScoreByOthers">查询</el-button>
                </el-col>
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
                    <el-table-column  label="操作" align="center" fixed="right" width="100px">
                        <template slot-scope="scope"><!--//作用域插槽-->
                            <el-button size="small" type="primary" @click="getscore(scope.row.inId)"
                                       :disabled="scope.row.intershipscore==='1'||scope.row.intershipscore==='2'||scope.row.intershipscore==='3'||
                                       scope.row.intershipscore==='4'||scope.row.intershipscore==='5'?true:false">
                                成 绩</el-button>
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
            <el-dialog class="dialog" title="学生实习成绩" :visible.sync="givescoreDialogVisible" width="40%" @close="editinfoDialogClosed">
                <el-radio-group v-model="radio">
                    <el-radio :label="5">优秀</el-radio>
                    <el-radio :label="4">良好</el-radio>
                    <el-radio :label="3">中等</el-radio>
                    <el-radio :label="2">及格</el-radio>
                    <el-radio :label="1">不及格</el-radio>
                </el-radio-group>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                    <el-button type="danger"  @click="cancel" style="margin-right: 50px">取消</el-button>
                    <el-button type="primary"  @click="submit" style="margin-right: 50px">确认</el-button>
                </span>
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
                inid:null
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
                            query: this.inputText
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
                            query: this.inputText
                        }
                    });
                this.infoList=result.data.list
                this.datacount=result.data.total
            },
            getscore(inid){
                this.givescoreDialogVisible=true
                this.inid=inid
            },
            editinfoDialogClosed(){
                this.radio=null
            },
            cancel(){
                this.givescoreDialogVisible=false
                this.radio=null
            },
            async submit(){
                const result = await this.$http.get('internshipinfo/givestudentscore',
                    {
                        params: {
                            inid: this.inid,
                            score:this.radio
                        }
                    });
                this.givescoreDialogVisible=false
                this.$message.success("学生实习成绩提交成功！")
                this.getStudentIntershipScore()
            }
        },
        created() {
            this.getStudentIntershipScore()
        }
    }
</script>

<style scoped>

</style>
