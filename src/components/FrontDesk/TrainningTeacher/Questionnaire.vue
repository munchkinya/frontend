<template>
    <div class="hello">
        <el-form ref="modelForm" :rule="rules" :model="modelForm" label-position="right" label-width="100px">
            <vuedraggable v-model="modelForm.topic" class="wrapper" @end="end">
                <div v-for="(item, index) in modelForm.topic" :key="index">
                    <el-collapse>
                        <el-collapse-item>
                            <template slot="title">
                                第{{ index+1 }}题,题目:{{ item.questionName }}
                            </template>
                            <!-- 问题 -->
                            <el-form-item
                                    :prop="`topic.${index}.type`"
                                    :label="`问题${index + 1}类型`"
                                    :rules="{ required: true, message: '请选择问题类型', trigger: 'change' }"
                            >
                                <el-radio-group v-model="item.type">
                                    <el-radio :label="0">单选题</el-radio>
                                    <el-radio :label="1">多选题</el-radio>
                                    <el-radio :label="2">填空题</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!--              //问题-->
                            <el-form-item
                                    :prop="`topic.${index}.questionName`"
                                    label="问题"
                                    :rules="{ required: true, message: '请填写问题', trigger: 'change' }"
                            >
                                <el-input v-model.trim="item.questionName" style="width:258px" clearable placeholder="请填写问题" />
                            </el-form-item>
                            <!-- 答案 -->
                            <el-form-item
                                    v-for="(opt, idx) in item.answers"
                                    v-show="item.type!=2"
                                    :key="idx"
                                    :label="`选项${idx + 1}`"
                                    :prop="`topic.${index}.answers.${idx}.value`"
                                    :rules="[
                  { required: true, message: '请输入答案', trigger: 'blur' },
                ]"
                            >
                                <el-input v-model.trim="opt.value" style="width:258px" clearable placeholder="请输入答案" />
                                <el-button style="margin-left: 20px" @click.prevent="removeDomain(index,idx)">删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button v-show="item.type!=2" @click="addDomain(index)">新增选项</el-button>
                                <el-button @click="removeQuestion(index)">删除题目</el-button>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </vuedraggable>
            <el-form-item>
                <el-button @click="addQuestion">新增题目</el-button>
                <el-button style="margin-top: 10px" @click="addSubmit()">提交</el-button>
                <el-button @click="resetForm('modelForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import vuedraggable from 'vue-draggable'
    export default {
        name: "Questionnaire",
        components: {
            vuedraggable
        },
        data() {
            return {
                rules: {},
                modelForm: {
                    topic: [{
                        type: '',
                        questionName: '',
                        answers: [{value: ''}]
                    }, {
                        type: '',
                        questionName: '',
                        answers: [{value: ''}]
                    }]
                }
            }
        },
        methods: {
            end(evt) {
                this.$refs.modelForm.clearValidate()
            },
            removeDomain(index, idx) { // 删除选项
                this.modelForm.topic[index].answers.splice(idx, 1)
            },
            removeQuestion(index) {//删除题目
                this.modelForm.topic.splice(index, 1)
            },
            addDomain(index) { // 新增选项
                this.modelForm.topic[index].answers.push({value: ''})
            },
            addQuestion() { // 新增题目
                this.modelForm.topic.push({type: '', questionName: '', answers: [{value: ''}]})
            },
            resetForm(formName) { // 重置
                this.$refs[formName].resetFields()
            },
            addSubmit() {
                this.$refs.modelForm.validate(valid => {
                    if (valid) {
                        console.log(this.modelForm.topic)
                    }
                })
            }

        }
    }
</script>

<style scoped>

</style>
