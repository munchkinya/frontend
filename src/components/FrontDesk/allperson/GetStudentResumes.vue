<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>查看简历</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="10"><!--搜索框和按钮之间的间隔-->
                <el-col :span="6" style="margin-left: 30px;margin-bottom: 30px">
                    <el-input
                            placeholder="请输入学生姓名"
                            v-model="inputText"
                            clearable>
                    </el-input>
                </el-col>
                <el-col :span="6" style="margin-left: 30px">
                    <el-button type="primary" @click="getStudentResumesByOthers">查询</el-button>
                </el-col>
                <el-table :data="resumeList" border stripe :default-sort = "{prop: 'updatetime', order: 'descending'}">
                    <!--label每一列的标题-->
                    <el-table-column type="index" label="#" width="40" align="center"></el-table-column>
                    <el-table-column prop="stu_number" label="学生学号" align="center" width="100"></el-table-column>
                    <el-table-column prop="stu_name" label="学生姓名" align="center" width="120"></el-table-column>
                    <el-table-column prop="filename" label="简历名称" align="center" ></el-table-column>
                    <el-table-column prop="inter_name" label="招聘公司" align="center"></el-table-column>
                    <el-table-column prop="updatetime" label="提交时间" align="center" width="120" sortable></el-table-column>
                    <el-table-column  label="操作" align="center" width="100">
                        <template slot-scope="scope"><!--//作用域插槽-->
                            <el-button size="small" type="primary" @click="downloadResume(scope.row.id,scope.row.filename)">查看</el-button>
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
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "GetStudentResumes",
        data(){
            return{
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认六条一页
                },
                datacount:0,//为了分页显示的时候,
                inputText:'',
                resumeList:[],
            }
        },
        methods:{
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getStudentWeekDiary();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getStudentWeekDiary();
            },
            async getStudentResumes(){
                const result = await this.$http.get('student/resume/getresumesbyst',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            query: this.inputText,
                            roleId: window.sessionStorage.getItem('roleId'),
                        }
                    });
                if(result.data.list.length===1 && result.data.list[0].id===0){
                    this.resumeList=[]
                    this.datacount=0
                }else{
                    this.resumeList=result.data.list;
                    this.datacount=result.data.total
                }
            },
            async getStudentResumesByOthers(){
                this.queryInfo.pagenum=1
                this.queryInfo.pagesize=5
                const result = await this.$http.get('student/resume/getresumesbyst',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            query: this.inputText,
                            roleId: window.sessionStorage.getItem('roleId'),
                        }
                    });
                if(result.data.list.length===1 && result.data.list[0].id===0){
                    this.resumeList=[]
                    this.datacount=0
                }else{
                    this.resumeList=result.data.list;
                    this.datacount=result.data.total
                }
            },
            async downloadResume(id,filename) {
                fetch('http://localhost:8888/uploaderfile/downloadresume', {
                    method:"POST",
                    headers: {
                        'access_token':window.sessionStorage.getItem('token'),
                        'id':id
                    }
                }).then(res => res.blob())
                    .then(data => {
                        let blobUrl = window.URL.createObjectURL(new Blob([data]));
                        this.download(blobUrl,filename);
                    });
            },
            download(blobUrl,filename) {
                let a = document.createElement('a')
                a.setAttribute("download",filename)
                a.href = blobUrl;
                a.click();
            },
        },
        created() {
            this.getStudentResumes()
        }
    }
</script>

<style scoped>

</style>
