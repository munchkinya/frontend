<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实习管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>实习公司维护</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12"><!--宽度-->
                    <el-input placeholder="请输入想查询的实习公司名称" v-model="queryInfo.query" class="input-with-select" clearable
                              @clear="getInternshipComList">
                        <el-button slot="append" icon="el-icon-search" @click="getInternshipComList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加实习公司</el-button>
                </el-col>
            </el-row>

            <!--:data为表格绑定一个数据源，prop为每一列表示渲染的数据对象-->
            <el-table :data="internshipcomList" border stripe>
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="interName" label="公司名称" width="180"></el-table-column>
                <el-table-column prop="principal" label="负责人" width="100"></el-table-column>
                <el-table-column prop="interTel" label="负责人联系方式" width="150"></el-table-column>
                <el-table-column prop="address" label="公司地址"></el-table-column>
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
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.interId)"></el-button>
                        <!--删除按钮--><!--用不到了-->
                        <!--<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>-->

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
            <el-dialog title="添加实习公司" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
                <!--内容主体区-->
                <el-form :model="icaddForm" :rules="icaddFormrules" ref="icaddFormRef" label-width="130px">
                    <el-form-item label="公司名称" prop="interName">
                        <el-input v-model="icaddForm.interName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="interPassword">
                        <el-input v-model="icaddForm.interPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="principal">
                        <el-input v-model="icaddForm.principal"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人联系方式" prop="interTel">
                        <el-input v-model="icaddForm.interTel"></el-input>
                    </el-form-item>
                    <el-form-item label="公司地址" prop="address">
                        <el-input v-model="icaddForm.address"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
                </span>
            </el-dialog>

        <!--修改用户的对话框-->
        <el-dialog title="修改实习公司" :visible.sync="editicDialogVisible" width="50%" @close="editicDialogClosed">
            <!--内容主体区-->
            <el-form :model="iceditForm" :rules="iceditFormrules" ref="iceditFormRef" label-width="130px">
                <el-form-item label="公司名称" prop="interName">
                    <el-input v-model="iceditForm.interName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="interPassword">
                    <el-input v-model="iceditForm.interPassword"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="principal">
                    <el-input v-model="iceditForm.principal"></el-input>
                </el-form-item>
                <el-form-item label="负责人联系方式" prop="interTel">
                    <el-input v-model="iceditForm.interTel"></el-input>
                </el-form-item>
                <el-form-item label="公司地址" prop="address">
                    <el-input v-model="iceditForm.address"></el-input>
                </el-form-item>
            </el-form>
            <!--底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editicDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "InternshipCompany",
        data () {
            //自定义验证手机号的规则
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
                internshipcomList:[],
                total:0,
                addDialogVisible:false,
                icaddForm:{
                    interName:'' ,
                    principal:'',
                    interTel:'',
                    address:'',
                    interPassword:''
                },
                icaddFormrules:{
                    interName:[
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    principal:[
                        {required: true, message: '请输入负责人', trigger: 'blur'}
                    ],
                    interTel:[
                        {required: true, message: '请输入负责人联系电话', trigger: 'blur'},
                        {validator:checkMobile,trigger: 'blur'}//指定自定义手机号验证规则
                    ],
                    address:[
                        {required: true, message: '请输入公司地址', trigger: 'blur'}
                    ],
                    interPassword:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                editicDialogVisible:false,
                iceditForm:{},
                iceditFormrules:{
                    interName:[
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    principal:[
                        {required: true, message: '请输入负责人', trigger: 'blur'}
                    ],
                    interTel:[
                        {required: true, message: '请输入负责人联系电话', trigger: 'blur'},
                        {validator:checkMobile,trigger: 'blur'}//指定自定义手机号验证规则
                    ],
                    address:[
                        {required: true, message: '请输入公司地址', trigger: 'blur'}
                    ],
                    interPassword:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getInternshipComList()
        },
        methods:{
            async getInternshipComList() {//必须要在data定义参数
                const result = await this.$http.get('internshipcompany/getallintercoms',
                    {
                        params: {
                            query: this.queryInfo.query,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取用户列表失败！');
                //如果没有return，说明获取成功了，那就保存导data中
                this.internshipcomList = result.data.list;
                this.total = result.data.total;
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getInternshipComList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getInternshipComList();
            },
            //监听switch开关状态的改变
            async userStateChanged(userinfo) {
                const {data: res} = await this.$http.put(`/internshipcompany/deleintercom/${userinfo.interId}/${userinfo.delflag}`);
                this.$message.success("更新删除状态成功！")
            },
            addDialogClosed(){
                this.$refs.icaddFormRef.resetFields();
            }, //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
            addTodo() {
                this.$refs.iceditFormRef.validate(async valid => {
                    if (!valid) return;//表单预验证没通过
                    //可以发起添加用户的网络请求
                    let {data: res} = await this.$http.get('internshipcompany/insertinterncom',
                        {
                            params: {
                                interName: this.icaddForm.interName,
                                principal: this.icaddForm.principal,
                                interTel: this.icaddForm.interTel,
                                address: this.icaddForm.address,
                                interPassword: this.icaddForm.interPassword
                            }
                        });
                    if (res === "success") {
                        this.$message.success('添加实习公司成功！');
                        this.addDialogVisible = false;//添加成功之后，把添加用户对话框关闭
                        this.getInternshipComList();//重新获取列表
                    } else if (res === "again") {
                        this.$message.error('添加实习公司失败，相同公司已添加过！');
                    } else {
                        this.$message.error('添加实习公司失败！');
                    }
                })
            },
            //弹出编辑页面
            async showEditDialog(id){
                let {data:res} = await this.$http.get('internshipcompany/getoneIC',
                    {
                        params: {
                            interId: id
                        }
                    });
                this.iceditForm=res;
                this.editicDialogVisible=true//显示编辑页面
            },
            //监听修改用户对话框的关闭事件
            editicDialogClosed(){
                this.$refs.iceditFormRef.resetFields();
            },
            //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
            editUser(){
                this.$refs.iceditFormRef.validate( async valid => {
                    if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
                    //否则发起修改用户的请求
                    const {data: res} = await this.$http.get('internshipcompany/updateic',
                        {
                            params: {
                                interId: this.iceditForm.interId,
                                interName:this.iceditForm.interName,
                                interPassword:this.iceditForm.interPassword,
                                principal:this.iceditForm.principal,
                                interTel:this.iceditForm.interTel,
                                address:this.iceditForm.address
                            }
                        });
                    if(res.vueStatus!=="again"){
                        this.editicDialogVisible=false;//添加成功之后，把修改用户对话框关闭
                        this.getInternshipComList();//重新获取列表
                        this.$message.success("更新实习公司信息成功！")
                    }else{
                        this.$message.error("更新实习公司信息失败，该实习公司已存在，请认真核对信息！")
                    }
                })
            }





        }
    }
</script>

<style scoped>

</style>
