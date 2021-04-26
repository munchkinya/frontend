<template>
    <div class="block">
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>实习反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card style="height: 450px">
            <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
                <el-form-item label="评语：" style="min-height: 200px" prop="feedback">
                    <el-input type="textarea" v-model="form.feedback" :disabled="flag"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" style="float: right" :disabled="flag">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "FeedBack",
        data() {
            return {
                form:{},
                flag:false,
                formRules: {
                    feedback: [
                        {required: true, message: '必须输入反馈', trigger: 'blur'}
                    ],
                }
            }
        },
        methods:{
            async getInfo(){
                const result = await this.$http.get('internshipinfo/getastudentIn',
                    {
                        params: {
                            stuNum: window.sessionStorage.getItem('username'),
                        }
                    });
                this.form=result.data
                if(this.form.feedback!==''&&this.form.feedback!==null){
                    this.flag=true
                }
            },
            onSubmit(){
                this.$refs.form.validate(async valid => {//=》是回调函数，valid是布尔类型的返回值,true是验证通过
                    if (!valid) return;
                    const {data: res} = await this.$http.put(`/internshipinfo/feedback/${this.form.inId}/${this.form.feedback}`);
                    this.$message.success("成功提交反馈")
                    this.getInfo();
                })
            }
        },
        created() {
            this.getInfo();
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .el-form-item__content{
        min-height: 200px!important;
    }

</style>
