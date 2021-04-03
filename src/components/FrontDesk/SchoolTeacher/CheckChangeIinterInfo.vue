<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>审核实习变更</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
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
                    <el-button type="primary" @click="getStudentChangeInfoByOthers">查询</el-button>
                </el-col>
                <el-table :data="infoList" border stripe >
                    <!--label每一列的标题-->
                    <el-table-column type="index" label="#" width="80" align="center"></el-table-column>
                    <el-table-column prop="stunumber" label="学生学号" align="center"></el-table-column>
                    <el-table-column prop="stuname" label="学生姓名" align="center"></el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope"><!--//作用域插槽-->
                            <el-button size="small" type="primary" @click="showCheckDialog(scope.row.stuId,scope.row.inId)">审  核</el-button>
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
                <el-dialog class="dialog" title="审核实习信息更改" :visible.sync="editintershipinfoDialogVisible" width="65%" @close="editinfoDialogClosed">
                    <el-form :inline="true" :model="dialogForm" ref="dialogFormRef" label-width="100px" >
                        <el-form-item label="学生学号：" label-width="90px">
                            <el-input v-model="dialogForm.stunumber" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="学生姓名：" label-width="90px">
                            <el-input v-model="dialogForm.stuname" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="原实习公司：" label-width="120px">
                            <el-input v-model="dialogForm.intername" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="现实习公司：" label-width="120px">
                            <el-input v-model="dialogForm.new_company" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="原公司地址：" label-width="120px">
                            <el-input v-model="dialogForm.address" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="现公司地址：" label-width="120px">
                            <el-input v-model="dialogForm.new_address" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="原岗位：">
                            <el-input v-model="dialogForm.old_post" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="现岗位：">
                            <el-input v-model="dialogForm.new_post" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="原实习开始时间：" label-width="150px">
                            <el-date-picker v-model="dialogForm.starttime" readonly></el-date-picker>
                        </el-form-item>
                        <el-form-item label="现实习开始时间：" label-width="150px">
                            <el-date-picker v-model="dialogForm.new_starttime" readonly></el-date-picker>
                        </el-form-item>
                        <el-form-item label="原实习结束时间：" label-width="150px">
                            <el-date-picker v-model="dialogForm.endtime" readonly></el-date-picker>
                        </el-form-item>
                        <el-form-item label="现实习结束时间：" label-width="150px">
                            <el-date-picker v-model="dialogForm.new_endtime" readonly></el-date-picker>
                        </el-form-item>
                        <el-form-item label="原薪资：" label-width="70px">
                            <el-input v-model="dialogForm.old_money" readonly></el-input>
                        </el-form-item>
                        <el-form-item>
                            <span style="color: #aa1111">元（RMB/月）</span>
                        </el-form-item>
                        <el-form-item label="现薪资：" label-width="70px">
                            <el-input v-model="dialogForm.new_money" readonly></el-input>
                        </el-form-item>
                        <el-form-item>
                            <span style="color: #aa1111">元（RMB/月）</span>
                        </el-form-item>
                        <el-form-item label="原因备注：">
                            <el-input type="textarea" v-model="dialogForm.text" readonly></el-input>
                        </el-form-item>
                    </el-form>
                    <!--底部按钮区-->
                    <span slot="footer" class="dialog-footer">
                    <el-button type="danger" round @click="untodo" style="margin-right: 50px">审核失败</el-button>
                    <el-button type="primary" round @click="todo" style="margin-right: 50px">审核通过</el-button>
                </span>
                </el-dialog>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "CheckChangeIinterInfo",
        data(){
            return{
                inputText:'',
                infoList:[],
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认六条一页
                },
                datacount:0,//为了分页显示的时候,
                editintershipinfoDialogVisible:false,
                dialogForm:[],
                new_id:null,
            }
        },
        methods: {
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
            async getStudentChangeInfo() {
                const result = await this.$http.get('internshipinfo/getstudentchangeinfo',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            query: this.inputText
                        }
                    });
                console.log(result.data.list)
                this.infoList=result.data.list
                this.datacount=result.data.list.length
            },
            async getStudentChangeInfoByOthers() {
                this.queryInfo.pagenum=1
                this.queryInfo.pagesize=5
                const result = await this.$http.get('internshipinfo/getstudentchangeinfo',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            query: this.inputText
                        }
                    });
                this.infoList=result.data.list
                this.datacount=result.data.list.length
            },
            //监听修改用户对话框的关闭事件
            editinfoDialogClosed(){
                this.$refs.dialogFormRef.resetFields();
            },
            async untodo(){
                //审核不通过
                const result = await this.$http.get('internshipinfo/getstudentchangeinfobysignal',
                    {
                        params: {
                            inid: this.new_id,
                            signal:'refuse'
                        }
                    });
                this.editintershipinfoDialogVisible=false
                this.$message.success("审核结果反馈成功！")
                this.getStudentChangeInfo()
            },
            async todo(){
                const result = await this.$http.get('internshipinfo/getstudentchangeinfobysignal',
                    {
                        params: {
                            inid: this.new_id,
                            signal:'accept'
                        }
                    });
                this.editintershipinfoDialogVisible=false
                this.$message.success("审核结果反馈成功！")
                this.getStudentChangeInfo()
            },
            async showCheckDialog(id,init_id){
                const result = await this.$http.get('internshipinfo/getstudentchangeinfobystuid',
                    {
                        params: {
                            stuID: id,
                        }
                    });
                this.new_id=init_id
                this.dialogForm=result.data
                this.editintershipinfoDialogVisible=true
            }
        },
        created() {
            this.getStudentChangeInfo()
        }
    }
</script>

<style lang="css" scoped>
    .dialog-footer{
        margin-top: 10px;
        margin-bottom: 20px;
    }
</style>
