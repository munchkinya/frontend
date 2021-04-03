<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>实习信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="提交信息"  description="如果要修改实习信息，请提交修改"></el-step>
                <el-step title="等待审核"  description="已提交修改信息，等待教师审核中"></el-step>
                <el-step title="审核结束"  description="教师已审核，请查看审核结果"></el-step>
            </el-steps>
            <el-button class="lookbutton" style="margin-right: 100px;float: right;margin-top: 20px;margin-bottom: 20px;"
                       @click="getCheckResult" type="primary" round :disabled="active!==2" plain>查看审核结果</el-button>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-row >
                <el-form :model="Form" :rules="FormRules" ref="FormRef" label-width="150px" :inline="true" style="margin-top: 10px;">
                    <el-form-item label="学号：" prop="stunumber" label-width="100px">
                        <el-input v-model="Form.stunumber" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="stuname" label-width="100px">
                        <el-input v-model="Form.stuname" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="原实习公司：" prop="intername">
                        <el-input v-model="Form.intername" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="原岗位：" prop="old_post" label-width="100px">
                        <el-input v-model="Form.old_post" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="实习开始时间：" prop="starttime" label-width="120px">
                        <el-date-picker v-model="Form.starttime" readonly></el-date-picker>
                    </el-form-item>
                    <el-form-item label="实习结束时间：" prop="endtime" label-width="120px">
                        <el-date-picker v-model="Form.endtime" readonly></el-date-picker>
                    </el-form-item>
                    <el-form-item label="原薪资：" prop="old_money" label-width="100px">
                        <el-input v-model="Form.old_money" readonly></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span style="color: #aa1111">元（RMB/月）</span>
                    </el-form-item>
                    <el-form-item label="实习状态：" prop="status" label-width="120px">
                        <el-input v-model="Form.status" readonly></el-input>
                    </el-form-item>
                    <el-divider></el-divider>
                    <el-form-item label="新实习公司：" prop="new_company" label-width="120px">
                        <el-input v-model="Form.new_company" :readonly="formlock"></el-input>
                    </el-form-item>
                    <el-form-item label="公司地址：" prop="new_address" label-width="120px">
                        <el-input v-model="Form.new_address" :readonly="formlock"></el-input>
                    </el-form-item>
                    <el-form-item label="新岗位：" prop="new_post" label-width="100px">
                        <el-input v-model="Form.new_post" :readonly="formlock"></el-input>
                    </el-form-item>
                    <el-form-item label="实习开始时间：" prop="new_starttime" label-width="200px">
                        <el-date-picker v-model="Form.new_starttime" :readonly="formlock"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="实习结束时间：" prop="new_endtime" label-width="200px">
                        <el-date-picker v-model="Form.new_endtime" :readonly="formlock"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="新薪资：" prop="new_money" label-width="100px">
                        <el-input v-model="Form.new_money" :readonly="formlock"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span style="color: #aa1111">元（RMB/月）</span>
                    </el-form-item>
                    <el-form-item label="原因备注：" label-width="100px" prop="text">
                        <el-input type="textarea" v-model="Form.text" :readonly="formlock"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <div style="float: right;margin-bottom: 20px;margin-top: 5px">
                <el-button type="primary" plain @click="editInfo" style="margin-right: 30px" :disabled="formlock">提交修改</el-button>
                <span style="margin-right: 80px;color: #67C23A">{{spanTest}}</span>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "UpdaeInternshipMessage",
        data(){
            const isNum = (rule, value, callback) => {
                const age= /^[0-9]*$/;
                if (!age.test(value)) {
                    callback(new Error('薪酬只能为数字'))
                }else{
                    callback()
                }
            };
            return {
                active: 0,
                Form:[],
                FormRules:{
                    new_company:[
                        {required: true, message: '请输入新的实习公司名称', trigger: 'blur'}
                    ],
                    new_post:[
                        {required: true, message: '请输入新的实习岗位', trigger: 'blur'}
                    ],
                    new_money:[
                        {required: true, message: '请输入新的薪酬', trigger: 'blur'},
                        { validator: isNum, trigger: 'blur' }
                    ],
                    new_starttime:[
                        {required: true, message: '请选择新的实习开始时间', trigger: 'blur'},
                    ],
                    new_endtime:[
                        {required: true, message: '请选择新的实习结束时间', trigger: 'blur'},
                    ],
                    new_address:[
                        {required: true, message: '请输入新的公司地址', trigger: 'blur'},
                    ],
                    text:[
                        {required: true, message: '请输入更改实习的原因', trigger: 'blur'},
                    ],
                },
                formlock:false,
                spanTest:'',
                signall:''
            }
        },
        methods: {
            next() {
                this.active++
            },
            async getFirstForm() {
                const result = await this.$http.get('internshipinfo/getastudentIn',
                    {
                        params: {
                            stuNum: window.sessionStorage.getItem('username'),
                        }
                    });
                this.Form=result.data
                this.active=result.data.action
                this.signall=result.data.signall
                if(this.active===1){
                    this.formlock=true
                    this.spanTest='审核中....'
                }else if(this.active===2){
                    this.formlock=true
                    this.spanTest='审核结束'
                }else{
                    this.formlock=false
                    this.spanTest=''
                }
            },
            editInfo(){
                this.$refs.FormRef.validate( async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.get('internshipinfo/updateastudentIn',
                        {
                            params: {
                                stuNum: this.Form.stunumber,
                                new_company:this.Form.new_company,
                                new_post:this.Form.new_post,
                                new_money:this.Form.new_money,
                                new_starttime:this.Form.new_starttime,
                                new_endtime:this.Form.new_endtime,
                                new_address:this.Form.new_address,
                                text:this.Form.text
                            }
                        });
                    if(res==='success'){
                        this.$message.success("提交修改成功！")
                        this.active=1;
                        this.spanTest='审核中....'
                        this.formlock=true
                    }
                })
            },
            getCheckResult(){
                var messages='';
                var status='';
                var that=this
                if(this.signall==='accept'){
                    messages='恭喜，您的审核通过了'
                    status='success'
                }else{
                    messages='抱歉，您未通过审核'
                    status='warning'
                }
                this.$notify({
                    title: '审核结果',
                    message: messages,
                    duration: 0,
                    type: status,
                    offset: 100,
                    onClose:function(){
                        if(that.signall !=='accept'){
                            that.$http.get('internshipinfo/refusechange',
                                {
                                    params: {
                                        inid: that.Form.inId,
                                    }
                                });
                        }else{
                            that.$http.get('internshipinfo/' +
                                'acceptchange',
                                {
                                    params: {
                                        inid: that.Form.inId,
                                    }
                                });
                        }
                        that.getFirstForm()
                    }
                });

            }
        },
        created() {
            this.getFirstForm()
        }
    }
</script>

<style scoped>


</style>
