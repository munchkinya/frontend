<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实训管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>实训企业维护</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12"><!--宽度-->
                    <el-input placeholder="请输入想查询的实训企业名称" v-model="queryInfo.query" class="input-with-select" clearable
                              @clear="getTrainingCompanyList">
                        <el-button slot="append" icon="el-icon-search" @click="getTrainingCompanyList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addtcDialogVisible=true">添加实训企业</el-button>
                </el-col>
            </el-row>
            <!--:data为表格绑定一个数据源，prop为每一列表示渲染的数据对象-->
            <el-table :data="traincompanyList" border stripe>
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="trainName" label="公司名称"></el-table-column>
                <el-table-column prop="principal" label="负责人" width="120"></el-table-column>
                <el-table-column prop="trainTel" label="负责人联系方式" ></el-table-column>
                <el-table-column prop="collagename" label="所在学院" ></el-table-column>
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
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.trainId)"></el-button>
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
            <el-dialog title="添加实训公司" :visible.sync="addtcDialogVisible" width="50%" @close="addtcDialogClosed">
                <!--内容主体区-->
                <el-form :model="tcaddForm" :rules="tcaddFormrules" ref="tcaddFormRef" label-width="130px">
                    <el-form-item label="公司名称" prop="trainName">
                        <el-input v-model="tcaddForm.trainName"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="principal">
                        <el-input v-model="tcaddForm.principal"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人联系方式" prop="trainTel">
                        <el-input v-model="tcaddForm.trainTel"></el-input>
                    </el-form-item>
                    <el-form-item label="所在院系" prop="collagename">
                        <el-select v-model="tcaddForm.collagename" placeholder="请选择" @change="getCollage(tcaddForm.collagename)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.coId"
                                    :label="item.coName"
                                    :value="item.coId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="edittcDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
                </span>
            </el-dialog>

            <!--修改用户的对话框-->
            <el-dialog title="修改实训公司" :visible.sync="edittcDialogVisible" width="50%" @close="edittcDialogClosed">
                <!--内容主体区-->
                <el-form :model="tceditForm" :rules="tceditFormrules" ref="tceditFormRef" label-width="130px">
                    <el-form-item label="公司名称" prop="trainName">
                        <el-input v-model="tceditForm.trainName"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="principal">
                        <el-input v-model="tceditForm.principal"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人联系方式" prop="trainTel">
                        <el-input v-model="tceditForm.trainTel"></el-input>
                    </el-form-item>
                    <el-form-item label="所在院系" prop="collagename">
                        <el-select v-model="tceditForm.collagename" placeholder="请选择" @change="getCollage(tceditForm.collagename)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.coId"
                                    :label="item.coName"
                                    :value="item.coId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="edittcDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "TrainingCompany",
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
                traincompanyList:[],
                total:0,
                addtcDialogVisible:false,
                options:[],
                tcaddForm:{
                    trainName:'',
                    principal:'',
                    trainTel:'',
                    collagename:''
                },
                tcaddFormrules:{
                    trainName:[
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    principal:[
                        {required: true, message: '请输入负责人', trigger: 'blur'}
                    ],
                    trainTel:[
                        {required: true, message: '请输入负责人联系电话', trigger: 'blur'},
                        {validator:checkMobile,trigger: 'blur'}//指定自定义手机号验证规则
                    ],
                    collagename:[
                        {required: true, message: '请选择所在院系', trigger: 'blur'}
                    ]
                },
                tceditForm:{},
                edittcDialogVisible:false,
                tceditFormrules:{
                    trainName:[
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    principal:[
                        {required: true, message: '请输入负责人', trigger: 'blur'}
                    ],
                    trainTel:[
                        {required: true, message: '请输入负责人联系电话', trigger: 'blur'},
                        {validator:checkMobile,trigger: 'blur'}//指定自定义手机号验证规则
                    ],
                    collagename:[
                        {required: true, message: '请选择所在院系', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getTrainingCompanyList()
            this.getAllCollage()
        },
        methods:{
            async getTrainingCompanyList() {//必须要在data定义参数
                const result = await this.$http.get('trainingcompany/getalltraincoms',
                    {
                        params: {
                            query: this.queryInfo.query,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取用户列表失败！');
                //如果没有return，说明获取成功了，那就保存导data中
                this.traincompanyList = result.data.list;
                this.total = result.data.total;
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getTrainingCompanyList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getTrainingCompanyList();
            },
            //监听switch开关状态的改变
            async userStateChanged(userinfo) {
                const {data: res} = await this.$http.put(`/trainingcompany/deletraincom/${userinfo.trainId}/${userinfo.delflag}`);
                this.$message.success("更新删除状态成功！")
            },
            //监听添加用户对话框的关闭事件
            addtcDialogClosed() {
                this.$refs.tcaddFormRef.resetFields();
            }, //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
            addTodo() {
                this.$refs.tcaddFormRef.validate( async valid => {
                    if(!valid) return ;//表单预验证没通过
                    //可以发起添加用户的网络请求
                    let {data:res}=await this.$http.get('trainingcompany/inserttraincom',
                        {
                            params: {
                                trainName: this.tcaddForm.trainName,
                                principal: this.tcaddForm.principal,
                                trainTel: this.tcaddForm.trainTel,
                                collagename:this.tcaddForm.collagename
                            }
                        });
                    if(res==="success"){
                        this.$message.success('添加实训公司成功！');
                        this.addtcDialogVisible=false;//添加成功之后，把添加用户对话框关闭
                        this.getTrainingCompanyList();//重新获取列表
                    }else if(res==="again"){
                        this.$message.error('添加实训公司失败，相同公司已添加过！');
                    }else{
                        this.$message.error('添加实训公司失败！');
                    }
                })
            },
            //选择器里面得到所有学院类型
            async getAllCollage() {
                // 发请求获取渠道下拉框的值
                let result = await this.$http.get('getallcollage');
                if (result.status === 200) {
                    // 把获取到的数据赋给this.data
                    this.options = result.data;
                }
            },
            //得到选择器里面选中的值,进行表单赋值
            getCollage(val){
                this.tcaddForm.collagename=val;//这里得到的是id
            },
            //弹出编辑页面
            async showEditDialog(id){
                let {data:res} = await this.$http.get('trainingcompany/getOneTC',
                    {
                        params: {
                            trainId: id
                        }
                    });
                this.tceditForm=res;
                this.edittcDialogVisible=true//显示编辑页面
            },
            //监听修改用户对话框的关闭事件
            edittcDialogClosed(){
                this.$refs.tceditFormRef.resetFields();
            },
            //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
            editUser(){
                this.$refs.tceditFormRef.validate( async valid => {
                    if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
                    //否则发起修改用户的请求
                    const {data: res} = await this.$http.get('trainingcompany/updatetc',
                        {
                            params: {
                                trainId: this.tceditForm.trainId,
                                trainName:this.tceditForm.trainName,
                                collageId:this.tceditForm.collageId,
                                principal:this.tceditForm.principal,
                                trainTel:this.tceditForm.trainTel
                            }
                        });
                    if(res.vueStatus!=="again"){
                        this.edittcDialogVisible=false;//添加成功之后，把修改用户对话框关闭
                        this.getTrainingCompanyList();//重新获取列表
                        this.$message.success("更新实训公司信息成功！")
                    }else{
                        this.$message.error("更新实训公司信息失败，该实训公司已存在，请认真核对信息！")
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
