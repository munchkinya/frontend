<template>
    <div>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12" :offset="1"><!--宽度-->
                    <p>请选择你想要发送的教师：
                        <el-cascader
                                :change-on-select="true"
                                :props="defaultParams"
                                :options="options1"
                                v-model="selectedOptions1"
                                :clearable="true"
                                placeholder="学院/教师"
                                @change="handleChange1(studentaddForm.selectedOptions1)">
                        </el-cascader>
                    </p>

                    <p>上传你的文件：</p>
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
                    <!--<in-form ref="inForm" :form="work" :rules="rules" :is-file="true">

                        <el-button type="success" v-else @click="uploadReferenceFile">
                            上传答案 <span v-text="work.reference"></span>
                            <input type="file" class="upload-file" ref="referenceFile" @change="setReferenceFile">
                        </el-button>
                    </in-form>-->

                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Studentsubmitdocument",
        data () {
            return {
                options1:[],
                selectedOptions1:[]
            }
        },
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
