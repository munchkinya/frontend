<template>
    <div>
        <el-card>
            <!--内容主体区-->
            <p>基本信息</p>
            <el-form :model="tteditForm" :rules="tteditFormrules" ref="tteditFormRef" label-width="100px">
                <el-form-item label="用户名" prop="tteachNumber">
                    <el-input v-model="tteditForm.tteachNumber" placeholder="电话号码或者邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="tteachPassword">
                    <el-input v-model="tteditForm.tteachPassword"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="tteachName">
                    <el-input v-model="tteditForm.tteachName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="tteachSex">
                    <el-radio-group v-model="tteditForm.tteachSex">
                        <el-radio border label="男"></el-radio>
                        <el-radio border label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--级联选择器-->

                <!--底部按钮区-->
                <el-form-item class="btns">
                    <el-button type="info">重 置</el-button>
                    <el-button type="danger" @click="login">保 存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script>
    export default {
        data () {
            return {
                tteditForm:{},
                tteditFormrules:{
                    tteachNumber:[
                        {required: true, message: '请输入用户名,为手机号或者邮箱', trigger: 'blur'}
                    ],
                    tteachPassword:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    tteachName:[
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    tteachSex:[
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    selectedOptions:[
                        {required: true, message: '请选择详细信息', trigger: 'blur'}
                    ],
                    roleid:[
                        {required: true, message: '请选择实训教师角色', trigger: 'change'}
                    ]
                },
                defaultParams:{

                },





            }
        },
       methods:{

       }
    }
</script>
<style lang="less" scoped>
p{
    font-size: 20px;
    margin-left: 40px;
    margin-bottom: 40px;
}
.btns{
    display: flex;//变成一个弹性模型
    justify-content: flex-end;/*居右对齐*/
}
</style>
