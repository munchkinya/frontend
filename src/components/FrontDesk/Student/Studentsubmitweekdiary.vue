<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>实习周记</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12"><!--宽度-->
                    <span style="margin-left: 20px">下载样表：</span>
                    <el-button style="margin-left: 30px" type="primary">
                        <a style="color: #ffffff;" class='download' href='http://localhost:8888/data/实习周记样表.docx' download="实习周记样表.docx" title="实习周记样表下载">
                            点击下载
                        </a>
                    </el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-table :data="weekdiaryList" border stripe>
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
                <el-table-column prop="week" label="周数" align="center"></el-table-column>
                <el-table-column prop="filename" label="名称" align="center" width="480px"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-upload
                                class="upload-demo"
                                action="http://localhost:8888/api/weekdiary/upload"
                                ref="upload"
                                :headers="headers"
                                :data="{'upload_id': scope.row.id}"
                                :on-success="handleFilUploadSuccess"
                                :show-file-list="false">
                            <el-button size="mini" type="primary" :disabled="scope.row.status!==0">提交</el-button>
                        </el-upload>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-tag :type="getTagType[scope.row.status]">{{scope.row.status===0?'未提交':'已提交'}}</el-tag>
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
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Studentsubmitweekdiary",
        data(){
            return{
                weekdiaryList:[],
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认六条一页
                },
                datacount:0,//为了分页显示的时候,
                tagcontent:'',
                getTagType:['danger','success'],
            }
        },
        methods: {
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getAllWeekDiaryList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getAllWeekDiaryList();
            },
            async getAllWeekDiaryList(){
                const result = await this.$http.get('weekdiary/getAllweekdiary',
                    {
                        params: {
                            stuId: window.sessionStorage.getItem('username'),
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                this.weekdiaryList=result.data.list;
                this.datacount=result.data.total
            },
            // 文件上传成功时的函数
            handleFilUploadSuccess (res,file,fileList) {
                if(res==='success'){
                    this.$message.success("周报上传成功")
                    this.getAllWeekDiaryList()
                }else{
                    this.$message.error("周报"+file.name+"上传失败")
                }
            },
        },
        created() {
            this.getAllWeekDiaryList()
        },
        computed: {
            headers() {
                return{
                    "access_token": window.sessionStorage.getItem('token')
                }
            }
        },
    }
</script>

<style scoped>

</style>
