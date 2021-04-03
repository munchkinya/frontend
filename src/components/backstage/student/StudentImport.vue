<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>学生信息导入</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card style="margin-bottom: 10px">
            <!--栅格系统-->
            <!--<el-row :gutter="20">&lt;!&ndash;搜索框和按钮之间的间隔&ndash;&gt;-->
            <el-button style="margin-left: 30px" type="primary">
                <a style="color: #ffffff;" class='download' href='http://localhost:8888/sampleexcel/附件1：获学校优秀奖学金学生登记表（李雅婷）.doc' download="学生信息样表.xls" title="excel模板下载">
                    Excel模板下载
                </a>
            </el-button>
        </el-card>
        <el-card>
            <!--<el-col :span="12">&lt;!&ndash;宽度&ndash;&gt;-->
            <el-upload style="margin-left: 30px"
                       class="upload-demo"
                       ref="upload"
                       drag
                       action="http://localhost:8888/uploaderfile/upload"
                       multiple
                       :headers="headers"
                       :limit="5"
                       :on-success="handleFilUploadSuccess"
                       :on-remove="handleRemove"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                </div>
            </el-upload>
           <span style="color: #B11E1F;font-size: 14px;margin-top: 10px;margin-left: 35px">注：所上传的Excel文件必须要符合样表要求，否则会上传失败</span>
               <!-- </el-col>-->
            <!--</el-row>-->
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Import",
        data(){
            return{
                token:''
            }
        },
        methods:{
            handleRemove(file,fileList) {
                console.log(file,fileList);
            },
            // 文件上传成功时的函数
            handleFilUploadSuccess (res,file,fileList) {
                if(res==='success'){
                    this.$message.success("文件上传成功")
                }else{
                    this.$message.error("文件"+file.name+"上传失败")
                }
            }
        },
        created() {
            this.token=window.sessionStorage.getItem('token');
        },
        computed: {
            headers() {
                return{
                    "access_token": this.token
                }
            }
        },
    }
</script>

<style scoped>

</style>
