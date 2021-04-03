<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实训管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>企业教师维护</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12"><!--宽度-->
                    <el-input placeholder="请输入想查询的实训教师姓名" v-model="queryInfo.query" class="input-with-select" clearable
                              @clear="getTrainingTeacherList">
                        <el-button slot="append" icon="el-icon-search" @click="getTrainingTeacherList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加实训教师</el-button>
                </el-col>
            </el-row>

            <!--:data为表格绑定一个数据源，prop为每一列表示渲染的数据对象-->
            <el-table :data="trainteacherList" border stripe>
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="tteachNumber" label="用户名" width="170"></el-table-column>
                <el-table-column prop="tteachName" label="姓名" width="120"></el-table-column>
                <el-table-column prop="tteachSex" label="性别" width="80"></el-table-column>
                <el-table-column prop="traincompanyname" label="所属公司" width="180"></el-table-column>
                <el-table-column prop="directname" label="任教方向" width="120"></el-table-column>
                <el-table-column prop="dclassname" label="任教班级" width="120"></el-table-column>
                <el-table-column prop="collagename" label="所在院系" width="150"></el-table-column>
                <el-table-column prop="delflag" label="状态（默认未删除）" width="150">
                    <template slot-scope="scope"><!--{{scope.row}}可得到当前行的所有信息-->
                        <!--{{scope.row}}--><!--0代表没被删除，1代表删除-->
                        <el-switch
                                :active-value="0"
                                :inactive-value="1"
                                v-model="scope.row.delflag" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.tteachId)"></el-button>
                        <!--删除按钮--><!--用不到了-->
                        <!--<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>-->
                        <!--分配角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"  @click="setRole(scope.row)"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
            <!--添加用户的对话框-->
            <el-dialog title="添加实训教师" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
                <!--内容主体区-->
                <el-form :model="ttaddForm" :rules="ttaddFormrules" ref="ttaddFormRef" label-width="130px">
                    <el-form-item label="用户名" prop="tteachNumber">
                        <el-input v-model="ttaddForm.tteachNumber" placeholder="电话号码或者邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="tteachPassword">
                        <el-input v-model="ttaddForm.tteachPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="tteachName">
                        <el-input v-model="ttaddForm.tteachName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="tteachSex">
                        <el-radio-group v-model="ttaddForm.tteachSex">
                            <el-radio border label="男"></el-radio>
                            <el-radio border label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--级联选择器-->
                    <el-form-item label="详细信息" prop="selectedOptions">
                        <el-cascader
                                :change-on-select="true"
                                :props="defaultParams"
                                :options="options"
                                v-model="ttaddForm.selectedOptions"
                                :clearable="true"
                                placeholder="学院/公司/方向/班级"
                                @change="handleChange(ttaddForm.selectedOptions)">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="选择角色" prop="roleid">
                        <el-radio-group v-model="ttaddForm.roleid">
                            <el-radio border label="实训企业普通教师"></el-radio>
                            <el-radio border label="实训企业管理人员"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
                </span>
            </el-dialog>

            <!--修改的对话框-->
            <el-dialog title="修改实训教师" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <!--内容主体区-->
                <el-form :model="tteditForm" :rules="tteditFormrules" ref="tteditFormRef" label-width="130px">
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
                    <el-form-item label="详细信息" prop="selectedOptions">
                        <el-cascader
                                :change-on-select="true"
                                :props="defaultParams"
                                :options="options"
                                v-model="tteditForm.selectedOptions"
                                :clearable="true"
                                placeholder="学院/公司/方向/班级"
                                @change="handleChange(tteditForm.selectedOptions)">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="选择角色" prop="roleid">
                        <el-radio-group v-model="tteditForm.roleid">
                            <el-radio border label="实训企业普通教师"></el-radio>
                            <el-radio border label="实训企业管理人员"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>
            <!--分配角色的对话框-->
            <el-dialog
                    title="分配角色"
                    :visible.sync="setRoleDialogVisible"
                    width="40%">
                <div class="roleeditdialog">
                    <p>当前的用户：{{ttinfo.tteachName}}</p>
                    <p>当前的角色：{{ttinfo.rolename}}</p>
                    <p>分配新角色：
                        <el-select v-model="selectRoleIdtt" placeholder="请选择">
                            <el-option
                                    v-for="item in rolesList"
                                    :key="item.id"
                                    :label="item.rolename"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleChange">确 定</el-button>
                  </span>
            </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "TrainingTeacher",
        data () {
            //验证邮箱的规则
            var checkEmail=(rule,value,cb)=>{
                /*验证邮箱的正则表达式*/
                const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    //合法的邮箱
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            };
            //验证手机号的规则
            var checkMobile=(rule,value,cb)=>{
                /*验证手机号的正则表达式*/
                const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    //合法的邮箱
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            };
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认五条一页
                },
                trainteacherList:[],
                total:0,
                addDialogVisible:false,
                ttaddForm:{
                    tteachNumber:'',
                    tteachPassword:'',
                    tteachName:'',
                    tteachSex:'',
                    selectedOptions:[],
                    roleid:''
                },
                options:[],
                ttaddFormrules:{
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
                //级联选择器模板值
                defaultParams: {
                    label: 'name',
                    value: 'id',
                    children: 'children'
                },
                //这里是因为数组url有问题，所以传的字符串
                selectedOptions1:'',
                editDialogVisible:false,
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
                //分配角色的对话框的显示与隐藏
                setRoleDialogVisible:false,
                //需要被分配角色的用户信息
                ttinfo:{},
                //所有角色信息的数据对象
                rolesList:[],
                //下拉列表中已选中的值
                selectRoleIdtt:''
            }
        },
        created() {
            this.getTrainingTeacherList()
            this.getProductType();
        },
        methods:{
            async getTrainingTeacherList() {//必须要在data定义参数
                const result = await this.$http.get('trainingteacher/getalltrainteachers',
                    {
                        params: {
                            query: this.queryInfo.query,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取用户列表失败！');
                //如果没有return，说明获取成功了，那就保存导data中
                this.trainteacherList = result.data.list;
                this.total = result.data.total;
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getTrainingTeacherList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getTrainingTeacherList();
            },
            //监听switch开关状态的改变
            async userStateChanged(userinfo) {
                const {data: res} = await this.$http.put(`/trainingteacher/deletrainteach/${userinfo.tteachId}/${userinfo.delflag}`);
                this.$message.success("更新删除状态成功！")
            },//监听添加用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.ttaddFormRef.resetFields();
            }, //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
            addTodo() {
                this.$refs.ttaddFormRef.validate( async valid => {
                    if(!valid) return ;//表单预验证没通过
                    //可以发起添加用户的网络请求
                    let {data:res}=await this.$http.get('trainingteacher/inserttrainteach',
                        {
                            params: {
                                tteachNumber: this.ttaddForm.tteachNumber,
                                tteachPassword: this.ttaddForm.tteachPassword,
                                tteachName: this.ttaddForm.tteachName,
                                tteachSex: this.ttaddForm.tteachSex,
                                selectedOptions:this.selectedOptions1,
                                roleid:this.ttaddForm.roleid

                            }
                        });
                    if(res==="success"){
                        this.$message.success('添加实训教师成功！');
                        this.addDialogVisible=false;//添加成功之后，把添加用户对话框关闭
                        this.getTrainingTeacherList();//重新获取列表
                    }else if(res==="again"){
                        this.$message.error('添加实训教师失败，该用户名已被占用！');
                    }else{
                        this.$message.error('添加实训教师失败！');
                    }
                })
            },
            //得到级联选择器所有的值
            getProductType(){
                this.$http.get("trainingteacher/getallmessage")
                    .then(res=>{
                        // 将获得到的数据赋值给options
                        this.options=res.data;
                    });
            },
            //得到级联选择器中选中的值
            handleChange(val){
                this.selectedOptions1='';
                for(var i=0;i<val.length-1;i++){
                    this.selectedOptions1+=val[i]+','
                }
                this.selectedOptions1+=val[val.length-1];
            },
            //弹出编辑页面
            async showEditDialog(id){
                let {data:res} = await this.$http.get('trainingteacher/getOnett',
                    {
                        params: {
                            tteachId: id
                        }
                    });
                this.tteditForm=res;
                this.tteditForm.selectedOptions=[res.coid,res.trainId,res.diid,res.dclassId];
                if(res.role===6){
                    this.tteditForm.roleid='实训企业普通教师'
                }else{
                    this.tteditForm.roleid='实训企业管理人员'
                }
                this.editDialogVisible=true//显示编辑页面
            },
            //监听修改用户对话框的关闭事件
            editDialogClosed(){
                this.$refs.tteditFormRef.resetFields();
            },
            //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
            editUser(){
                this.$refs.tteditFormRef.validate( async valid => {
                    if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
                    //否则发起修改用户的请求
                    console.log(this.tteditForm)
                    const {data: res} = await this.$http.get('trainingteacher/updatett',
                        {
                            params: {
                                tteachId: this.tteditForm.tteachId,
                                tteachNumber:this.tteditForm.tteachNumber,
                                tteachPassword:this.tteditForm.tteachPassword,
                                tteachName:this.tteditForm.tteachName,
                                tteachSex:this.tteditForm.tteachSex,
                                trainId:this.tteditForm.selectedOptions[1],
                                dclassId:this.tteditForm.selectedOptions[3],
                                roleid:this.tteditForm.roleid
                            }
                        });
                    if(res.vueStatus!=="again"){
                        this.editDialogVisible=false;//添加成功之后，把修改用户对话框关闭
                        this.getTrainingTeacherList();//重新获取列表
                        this.$message.success("更新实训教师信息成功！")
                    }else{
                        this.$message.error("更新实训教师信息失败，该用户名已存在，请认真核对信息！")
                    }

                })
            },
            //展示分配角色的对话框
            async setRole(stinfo){
                this.ttinfo=stinfo;
                //在展示对话框之前获取所有的角色列表
                const result = await this.$http.get('/role/getAllRolesInTT');
                if (result.status !== 200) return this.$message.error('获取权限列表失败！');
                this.rolesList = result.data;
                this.setRoleDialogVisible=true
            },
            //点击确定按钮,分配角色
            async saveRoleChange(){
                //什么都没选的情况
                if(!this.selectRoleIdtt){
                    return this.$message.error('请选择要分配的角色')
                }
                const {data: res} = await this.$http.put(`/trainingteacher/updatettrole/${this.ttinfo.tteachId}/${this.selectRoleIdtt}`);
                this.$message.success("实训教师分配角色成功！");
                this.getTrainingTeacherList();
                this.setRoleDialogVisible=false
                this.selectRoleIdtt=null
            }
        }
    }
</script>

<style scoped>

</style>
