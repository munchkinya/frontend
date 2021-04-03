<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>学生成绩批量导入</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12"><!--宽度-->
                <el-upload
                        class="upload-demo"
                        drag
                        action="#"
                        multiple
                        :before-upload="beforeUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                    </div>
                </el-upload>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Import",
        methods:{
            beforeUpload(file){
                var formdata = new FormData();
                formdata.append('file',file);
                this.$http.post('http://localhost:8080/excel',formdata,{ headers : { 'Content-type':'multipart/form-data'}});
            }
        }
    }
</script>

<style scoped>

</style>
