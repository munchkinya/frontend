<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实习管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>学生实习维护</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
                <el-col :span="12"><!--宽度-->
                    <el-input placeholder="请输入想查询的学生姓名" v-model="queryInfo.query" class="input-with-select" clearable
                              @clear="getInternshipInfoList">
                        <el-button slot="append" icon="el-icon-search" @click="getInternshipInfoList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addiiDialogVisible=true">添加实习信息</el-button>
                </el-col>
            </el-row>
            <!--:data为表格绑定一个数据源，prop为每一列表示渲染的数据对象-->
            <el-table :data="internshipInfoList" border stripe>
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="stunumber" label="学号" width="100"></el-table-column>
                <el-table-column prop="stuname" label="姓名" width="120"></el-table-column>
                <el-table-column prop="coname" label="所在学院" width="120"></el-table-column>
                <el-table-column prop="intername" label="实习公司" width="150"></el-table-column>
                <el-table-column prop="starttime" label="实习开始时间" width="120" :formatter="dateFormat1"></el-table-column>
                <el-table-column prop="endtime" label="实习结束时间" width="120" :formatter="dateFormat2"></el-table-column>
                <el-table-column prop="status" label="实习状态" ></el-table-column>
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
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.inId)"></el-button>
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

            <!--添加用户的对话框-->
            <el-dialog title="添加实习信息" :visible.sync="addiiDialogVisible" width="50%" @close="addiiDialogClosed">
                <!--内容主体区-->
                <el-form :inline="true" :model="iiaddForm" :rules="iiaddFormrules" ref="iiaddFormRef" label-width="100px" >
                    <el-form-item label="学生学号" prop="stunumber">
                        <el-input v-model="iiaddForm.stunumber" placeholder="学号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item label="学生学号" prop="stunumber">
                        <el-input v-model="iiaddForm.stunumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学生姓名" prop="stuname">
                        <el-input v-model="iiaddForm.stuname"></el-input>
                    </el-form-item>
                    <el-form-item label="所在学院" prop="coname">
                        <el-input v-model="iiaddForm.coname"></el-input>
                    </el-form-item>
                    <!--下面开始自己手动填写-->
                    <el-form-item label="实习公司" prop="intername">
                        <el-select v-model="iiaddForm.intername" placeholder="请选择" @change="getInterCompany(iiaddForm.intername)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.interId"
                                    :label="item.interName"
                                    :value="item.interId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实习时间" required>
                        <el-date-picker
                                v-model="times"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                onPick>
                        </el-date-picker>
                    </el-form-item>
                    <!--这状态得自动生成-->
                    <el-form-item label="实习状态" prop="status">
                        <el-input v-model="iiaddForm.status"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addiiDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
                </span>
            </el-dialog>

            <!--修改用户的对话框-->
            <el-dialog title="修改实习信息" :visible.sync="editinfoDialogVisible" width="50%" @close="editinfoDialogClosed">
                <!--内容主体区-->
                <el-form :inline="true" :model="iieditForm" :rules="iieditFormrules" ref="iieditFormRef" label-width="100px" >


                    <el-form-item label="学生学号" prop="stunumber">
                        <el-input v-model="iieditForm.stunumber" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="学生姓名" prop="stuname">
                        <el-input v-model="iieditForm.stuname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="所在学院" prop="coname">
                        <el-input v-model="iieditForm.coname" disabled></el-input>
                    </el-form-item>

                    <!--下面开始自己手动填写-->
                    <el-form-item label="实习公司" prop="intername">
                        <el-select v-model="iieditForm.interId" placeholder="请选择" @change="getInterCompany1(iieditForm.interId)">
                            <el-option
                                    v-for="item in options"
                                    :key="item.interId"
                                    :label="item.interName"
                                    :value="item.interId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实习时间" required>
                        <el-date-picker
                                v-model="times1"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                onPick>
                        </el-date-picker>
                    </el-form-item>
                    <!--这状态得自动生成-->
                    <el-form-item label="实习状态" prop="status">
                        <el-input v-model="iieditForm.status"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部按钮区-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editinfoDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "InternshipInfo",
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
                //日期选择器，快捷选择键
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [end,start]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [end,start]);
                        }
                    }, {
                        text: '最近17周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() + 3600 * 1000 * 24 * 119);
                            picker.$emit('pick', [end,start]);
                        }
                    }]
                },
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认五条一页
                },
                times:[],//监控时间选择器变化
                times1:[],
                internshipInfoList:[],
                total:0,
                addiiDialogVisible:false,
                options:[],
                iiaddForm:{
                    stuId:'',
                    stunumber:'',
                    stuname:'',
                    coname:'',
                    intername:'',
                    starttime:'',
                    endtime:'',
                    status:'',
                },
                iiaddFormrules:{
                    stunumber:[
                        {required: true, message: '请输入学号', trigger: 'blur'}
                    ],
                    status:[
                        {required: true, message: '请输入实习状态', trigger: 'blur'}
                    ],
                    intername:[
                        {required: true, message: '请选择所在院系', trigger: 'blur'}
                    ],
                    stuname:[
                        {required: true, message: '请输入学生姓名', trigger: 'blur'}
                    ],
                    coname:[
                        {required: true, message: '请输入院系', trigger: 'blur'}
                    ]
                },
                iieditForm:{},
                editinfoDialogVisible:false,
                iieditFormrules:{
                    status:[
                        {required: true, message: '请输入实习状态', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getInternshipInfoList();
            this.getInterCopany()
        },
        watch:{
            //监控时间变化，赋值给表单
            times(){
                this.iiaddForm.starttime=this.times[0];
                this.iiaddForm.endtime=this.times[1];
                let dates1 = new Date(this.iiaddForm.endtime);
                let dates2 = new Date(new Date());
                if (dates1 > dates2) {
                    //结束日期晚于当前日期
                    this.iiaddForm.status='正在实习'
                } else {
                    //结束时间早于当前日期
                    this.iiaddForm.status='已结束实习'
                }
            },
            times1(){
                this.iieditForm.starttime=this.times1[0];
                this.iieditForm.endtime=this.times1[1];
                let dates1 = new Date(this.iieditForm.endtime);
                let dates2 = new Date(new Date());
                if (dates1 > dates2) {
                    //结束日期晚于当前日期
                    this.iieditForm.status='正在实习'
                } else {
                    //结束时间早于当前日期
                    this.iieditForm.status='已结束实习'
                }
            }
        },
        methods:{
            async getInternshipInfoList() {//必须要在data定义参数
                //这个表和其他表不一样的，因为status是根据实习结束时间推算出来的，
                //而实习结束时间是根据如果单个学生添加，状态是当时添加的时候确定的，但是时间是动态的
                //所以在每次都要更新状态，在申请表格的时候
                const result = await this.$http.get('internshipinfo/getallinterinfo',
                    {
                        params: {
                            query: this.queryInfo.query,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                if (result.status !== 200) return this.$message.error('获取用户列表失败！');
                //如果没有return，说明获取成功了，那就保存导data中
                this.internshipInfoList = result.data.list;
                this.total = result.data.total;
                /*这里看情况能不能还改好
                console.log(this.internshipInfoList);
                for(var i=0;i<this.internshipInfoList.length;i++){
                    let dates1 = new Date(this.internshipInfoList.endtime);
                    let dates2 = new Date(new Date());
                    if (dates1 > dates2) {
                        //结束日期晚于当前日期
                        this.internshipInfoList[i].status='正在实习'
                    } else {
                        //结束时间早于当前日期
                        this.internshipInfoList[i].status='已结束实习'
                    }
                }

                 */

            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getInternshipInfoList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getInternshipInfoList();
            },
            //监听switch开关状态的改变
            async userStateChanged(userinfo) {
                const {data: res} = await this.$http.put(`/internshipinfo/deleinterinfo/${userinfo.inId}/${userinfo.delflag}`);
                this.$message.success("更新删除状态成功！")
            },
            //监听添加用户对话框的关闭事件
            addiiDialogClosed() {
                this.$refs.iiaddFormRef.resetFields();
            }, //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
            addTodo() {
                this.$refs.iiaddFormRef.validate( async valid => {
                    if(!valid) return ;//表单预验证没通过
                    //可以发起添加用户的网络请求
                    let {data:res}=await this.$http.get('internshipinfo/insertinterinfo',
                        {
                            params: {
                                stuId:this.iiaddForm.stuId,
                                stunumber: this.iiaddForm.stunumber,
                                intername: this.iiaddForm.intername,
                                starttime: this.iiaddForm.starttime,
                                endtime:this.iiaddForm.endtime,
                                status:this.iiaddForm.status
                            }
                        });
                    if(res==="success"){
                        this.$message.success('添加实习信息成功！');
                        this.addiiDialogVisible=false;//添加成功之后，把添加用户对话框关闭
                        this.getInternshipInfoList();//重新获取列表
                    }else if(res==="again"){
                        this.$message.error('添加实习信息失败，该生的实习信息已添加过！');
                    }else{
                        this.$message.error('添加实习信息失败！');
                    }
                })
            },
            //选择器里面得到所有实习公司
            async getInterCopany() {
                // 发请求获取渠道下拉框的值
                let result = await this.$http.get('internshipinfo/getallintercompany');
                if (result.status === 200) {
                    // 把获取到的数据赋给this.data
                    this.options = result.data;
                }
            },
            //得到选择器里面选中的值,进行表单赋值
            getInterCompany(val){
                this.iiaddForm.intername=val;//这里得到的是id
            },
            //这里查询出学生的基本信息，然后渲染表单
            async onSubmit() {
                let result = await this.$http.get('internshipinfo/getstudent',
                    {
                        params: {
                            stunumber: this.iiaddForm.stunumber,
                        }
                    });
                if (result.status === 200) {
                    // 把获取到的数据赋给this.data
                    this.iiaddForm.stuname=result.data.stuName;
                    this.iiaddForm.coname=result.data.collagename;
                    this.iiaddForm.stuId=result.data.stuId
                }
            },
            //表格中日期的格式化开始日期
            dateFormat1(row, column) {
                var date = new Date(row.starttime);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "-" + month + "-" + day);
            },
            //日期的格式化结束日期
            dateFormat2(row, column) {
                var date = new Date(row.endtime);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "-" + month + "-" + day);
            },
            //弹出编辑页面
            async showEditDialog(id){
                let {data:res} = await this.$http.get('internshipinfo/getOneII',
                    {
                        params: {
                            interId: id
                        }
                    });
                this.iieditForm=res;
                this.times1[0]=res.starttime;
                this.times1[1]=res.endtime;
                this.editinfoDialogVisible=true//显示编辑页面
            },
            //监听修改用户对话框的关闭事件
            editinfoDialogClosed(){
                this.$refs.iieditFormRef.resetFields();
            },
            //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
            editUser(){
                this.$refs.iieditFormRef.validate( async valid => {
                    if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
                    //否则发起修改用户的请求
                    const {data: res} = await this.$http.get('internshipinfo/updateii',
                        {
                            params: {
                                inId: this.iieditForm.inId,
                                stuId:this.iieditForm.stuId,
                                interId:this.iieditForm.interId,
                                starttime:this.iieditForm.starttime,
                                endtime:this.iieditForm.endtime,
                                status:this.iieditForm.status
                            }
                        });
                    if(res.vueStatus!=="again"){
                        this.editinfoDialogVisible=false;//添加成功之后，把修改用户对话框关闭
                        this.getInternshipInfoList();//重新获取列表
                        this.$message.success("更新实习信息成功！")
                    }else{
                        this.$message.error("更新实习信息失败，该学生实习信息已存在，请认真核对信息！")
                    }
                })
            },//得到选择器里面选中的值,进行表单赋值
            getInterCompany1(val){
                this.iieditForm.interId=val;//这里得到的是id
            }

        }
    }
</script>

<style scoped>

</style>
