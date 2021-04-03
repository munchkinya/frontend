<template><!--提交简历页面-->
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>投放简历</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="10"><!--搜索框和按钮之间的间隔-->
                <el-col :span="8"><!--宽度-->
                    <span style="margin-left: 20px">公司：</span>
                    <el-select v-model="selectValue" placeholder="请选择正在招聘的公司">
                        <el-option
                                v-for="item in options"
                                :key="item.interId"
                                :label="item.interName"
                                :value="item.interId">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-upload
                            class="upload-demo"
                            action="http://localhost:8888/uploaderfile/upload"
                            ref="upload"
                            :headers="headers"
                            :data="params"
                            :on-success="handleFilUploadSuccess"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            accept=".pdf">
                        <el-button  type="primary">上传简历</el-button>
                    </el-upload>
                </el-col>
                <el-col :span="8">
                    <div style="color: #aa1111;font-size: 10px;margin-top: 20px">注意：只能上传pdf文件，且不超过500kb</div>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-table :data="resumeList" border stripe :default-sort = "{prop: 'updatetime', order: 'descending'}">
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
                <el-table-column prop="filename" label="简历名称" align="center"></el-table-column>
                <el-table-column prop="inter_name" label="招聘公司" align="center"></el-table-column>
                <el-table-column prop="updatetime" label="提交时间" align="center" sortable></el-table-column>
                <el-table-column prop="status" label="简历状态" align="center">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-tag :type="getTagType(scope.row.status)">{{tagcontent}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="其他" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :content="tooltipText(scope.row.status)" placement="top-end" effect="light">
                            <el-button size="mini">备注</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[2, 5, 8, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="datacount">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "PutResume",
        data(){
            return{
                selectValue:'',
                options:[],
                resumeList:[],
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认六条一页
                },
                datacount:0,//为了分页显示的时候,
                tagcontent:'',
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
            //得到所有正在招聘的公司
            async getCompanys() {
                const result = await this.$http.get('internshipcompany/getintercompanys');
                this.options=result.data;
            },
            async getStudentList() {//必须要在data定义参数
                const result = await this.$http.get('student/getallstudents',
                    {
                        params: {
                            query: this.queryInfo.query,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取用户列表失败！');
            },
            beforeUpload(){
                if(this.selectValue===''){
                    this.$message.error({
                        showClose: true,
                        message: "上传简历前必须要选择招聘公司"
                    });
                    return false
                }
            },
            // 文件上传成功时的函数
            handleFilUploadSuccess (res,file,fileList) {
                if(res==='success'){
                    this.$message.success("简历上传成功")
                    this.getResumeList()
                }else if(res==='again'){
                    this.$message.error({
                        showClose: true,
                        message: "简历名称重复，建议命名格式：学号+姓名+次数"
                    });
                }else{
                    this.$message.error("简历"+file.name+"上传失败")
                }
            },
            async getResumeList(){
                const result = await this.$http.get('student/resume/getAllResumes',
                    {
                        params: {
                            stuId: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                console.log(result)
                this.resumeList=result.data.list;
                this.datacount=result.data.list.length
                // console.log(this.total)
            },
            getTagType(tagtype){
                if(tagtype==='commit'){
                    this.tagcontent='正在审核...';
                    return ''
                }else if(tagtype==='sendback'){
                    this.tagcontent='被退回';
                    return 'danger'
                }else{
                    this.tagcontent='接受';
                    return 'success'
                }
            },
            tooltipText(tagtype){
                if(tagtype==='commit'){
                    return '你的简历已提交，不要着急，HR小姐姐正在审核'
                }else if(tagtype==='sendback'){
                    return '真可惜，你的简历被退回来了，不过不要灰心，再接再厉';
                }else{
                    return '恭喜！赶快准备你的面试吧，期待你的好消息'
                }
            }
        },
        created() {
            this.getResumeList()
            this.getCompanys();
            this.getTagType();
            this.tooltipText()
        },
        computed: {
            headers() {
                return{
                    "access_token": window.sessionStorage.getItem('token')
                }
            },
            params() {
                return{
                    "stu_id": window.sessionStorage.getItem('username'),
                    "intercom_id":this.selectValue
                }
            },
        },
    }
</script>

<style lang="less" scoped>

</style>
