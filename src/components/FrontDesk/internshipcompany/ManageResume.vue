<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>简历管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-table :data="resumeList" border stripe :default-sort = "{prop: 'updatetime', order: 'descending'}">
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="40" align="center"></el-table-column>
                <el-table-column prop="stu_number" label="学生学号" align="center" width="100"></el-table-column>
                <el-table-column prop="stu_name" label="学生姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="filename" label="简历名称" align="center" ></el-table-column>
                <el-table-column prop="updatetime" label="提交时间" align="center" width="120" sortable></el-table-column>
                <el-table-column  label="操作" align="center" width="100">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-button size="small" type="primary" @click="downloadResume(scope.row.id,scope.row.filename)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="反馈" align="center" width="200px">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-radio-group v-model="scope.row.status" size="small" fill="#F56C6C" :disabled="scope.row.status!=='commit'" @change="changeResumeStatus(scope.row.id,scope.row.status)">
                            <el-radio-button label="accepted" border>接受</el-radio-button>
                            <el-radio-button label="sendback" border>拒绝</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[4, 6, 8, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "ManageResume",
        data() {
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:6//默认六条一页
                },
                total:0,//为了分页显示的时候,
                resumeList:[],
                radio1:'',
                radioStatus:''

            }
        },
        methods: {
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getResumeList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getResumeList();
            },
            async getResumeList(){
                const result = await this.$http.get('student/resume/getAllResumesByInterCom',
                    {
                        params: {
                            intercomID: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                /*console.log(result.data.list)*/
                this.resumeList=result.data.list;
                this.total=result.data.total
            },
            async changeResumeStatus(id,changestatus) {
                const {data: res} = await this.$http.put(`student/resume/changestatus/${id}/${changestatus}`);
                if (res !== 0) {
                    this.$message.success('成功反馈简历信息')
                } else {
                    this.$message.error('成功反馈简历失败，请重试')
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
            this.getResumeList()
        },

    }
</script>

<style scoped>

</style>
