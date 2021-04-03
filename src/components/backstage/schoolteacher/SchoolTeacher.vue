<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学校教师管理</el-breadcrumb-item><!--这里写死了-->
        <el-breadcrumb-item>教师维护</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!--栅格系统-->
        <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
          <el-col :span="12"><!--宽度-->
            <el-input placeholder="请输入想查询的教师姓名" v-model="queryInfo.query" class="input-with-select" clearable
            @clear="getSchoolTeacherList">
              <el-button slot="append" icon="el-icon-search" @click="getSchoolTeacherList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加教师</el-button>
          </el-col>
        </el-row>
        <!--教师列表区域-->
        <!--:data为表格绑定一个数据源，prop为每一列表示渲染的数据对象-->
        <el-table :data="schoolteacherList" border stripe>
          <!--label每一列的标题-->
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="steachNumber" label="职工号" width="120"></el-table-column>
          <el-table-column prop="steachName" label="姓名" width="120"></el-table-column>
          <el-table-column prop="steachSex" label="性别" width="80"></el-table-column>
          <el-table-column prop="steachEmail" label="电子邮箱" width="180"></el-table-column>
          <el-table-column prop="steachTel" label="联系电话" width="130"></el-table-column>
          <el-table-column prop="coname" label="院系" width="150"></el-table-column>
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
          <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope"><!--//作用域插槽-->
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.steachId)"></el-button>
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
      <el-dialog title="添加教师" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主体区-->
        <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
          <el-form-item label="职工号" prop="steachNumber">
            <el-input v-model="addForm.steachNumber"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="steachPassword">
            <el-input v-model="addForm.steachPassword"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="steachName">
            <el-input v-model="addForm.steachName"></el-input>
          </el-form-item>
        <el-form-item label="性别" prop="steachSex">
          <el-radio-group v-model="addForm.steachSex">
            <el-radio border label="男"></el-radio>
            <el-radio border label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item label="邮箱" prop="steachEmail">
            <el-input v-model="addForm.steachEmail"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="steachTel">
            <el-input v-model="addForm.steachTel"></el-input>
          </el-form-item>
          <el-form-item label="所在院系" prop="coname">
            <el-select v-model="addForm.coname" placeholder="请选择" width="50%" @change="getCollage(addForm.coname)">
              <el-option
                      v-for="item in options"
                      :key="item.coId"
                      :label="item.coName"
                      :value="item.coId">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="选择角色" prop="roleid">
                <el-radio-group v-model="addForm.roleid">
                    <el-radio border label="学院普通教师"></el-radio>
                    <el-radio border label="学院领导"></el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <!--底部按钮区-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户的对话框-->
        <el-dialog
                title="修改教师"
                :visible.sync="editDialogVisible"
                width="40%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="职工号" prop="steachNumber">
                    <el-input v-model="editForm.steachNumber"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="steachPassword">
                    <el-input v-model="editForm.steachPassword"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="steachName">
                    <el-input v-model="editForm.steachName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="steachSex">
                    <el-radio-group v-model="editForm.steachSex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="steachEmail">
                    <el-input v-model="editForm.steachEmail"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="steachTel">
                    <el-input v-model="editForm.steachTel"></el-input>
                </el-form-item>
                <el-form-item label="所在院系" prop="coId">
                    <el-select v-model="editForm.coId" placeholder="请选择" width="50%" @change="getCollage(editForm.coId)">
                        <el-option
                                v-for="item in options"
                                :key="item.coId"
                                :label="item.coName"
                                :value="item.coId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
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
          <p>当前的用户：{{stinfo.steachName}}</p>
          <p>当前的角色：{{stinfo.rolename}}</p>
          <p>分配新角色：
            <el-select v-model="selectRoleId" placeholder="请选择">
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
  name: 'Student',
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
      schoolteacherList:[],
      options:[],
      total:0,//所有用户数据总量
      queryInfo:{
        query:'',
        pagenum:1,//默认从第一页
        pagesize:5//默认五条一页
      },
      /*控制添加用户对话框的显示与隐藏*/
      addDialogVisible:false,
      /*添加教师表单数据对象*/
      addForm:{
        steachNumber:'',
        steachPassword:'',
        steachName:'',
        steachSex:'',
        steachEmail:'',
        steachTel:'',
        coname:'',
        roleid:''
      },
      //添加教师的表单验证规则对象
      addFormrules:{
        steachNumber:[
          {required: true, message: '请输入职工号', trigger: 'blur'}
        ],
        steachPassword:[
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        steachName:[
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        steachSex:[
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        steachEmail:[
          {required: true, message: '请输入电子邮箱', trigger: 'blur'},
          {validator:checkEmail,trigger: 'blur'}
        ],
        steachTel:[
          {required: true, message: '请输入联系电话', trigger: 'blur'},
          {validator:checkMobile,trigger: 'blur'}
        ],
        coname:[
          {required: true, message: '请选择所在院系', trigger: 'blur'}
        ],
          roleid:[
              {required: true, message: '请选择教师角色', trigger: 'change'}
          ]
      },
      editDialogVisible:false,
      //修改用户页面的表单（查询到的用户信息保存）
      editForm:{},
      //修改表单的验证规则对象
      editFormRules:{
          steachNumber:[
              {required: true, message: '请输入职工号', trigger: 'blur'}
          ],
        steachPassword:[
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        steachName:[
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        steachSex:[
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        steachEmail:[
          {required: true, message: '请输入电子邮箱', trigger: 'blur'},
          {validator:checkEmail,trigger: 'blur'}//指定自定义邮箱验证规则
        ],
        steachTel:[
          {required: true, message: '请输入联系电话', trigger: 'blur'},
          {validator:checkMobile,trigger: 'blur'}//指定自定义手机号验证规则
        ],
        coId:[
          {required: true, message: '请选择所在院系', trigger: 'blur'}
        ]
      },
      //分配角色的对话框的显示与隐藏
      setRoleDialogVisible:false,
      //需要被分配角色的用户信息
      stinfo:{},
      //所有角色信息的数据对象
      rolesList:[],
      //下拉列表中已选中的值
      selectRoleId:''
    }
  },
  created() {
    this.getSchoolTeacherList();
    this.getAllCollage()
  },
  methods: {
    async getSchoolTeacherList() {//必须要在data定义参数
      const result = await this.$http.get('getAllSTs',
              {
                params: {
                  query: this.queryInfo.query,
                  pageNum: this.queryInfo.pagenum,
                  pageSize: this.queryInfo.pagesize
                }
              });
      if (result.status !== 200) return this.$message.error('获取用户列表失败！');
      //如果没有return，说明获取成功了，那就保存导data中
      this.schoolteacherList = result.data.list;
      this.total = result.data.total;
    },
    open() {
      this.$alert('<strong>这是 <i>{{total}}</i> 片段</strong>', '教师详细信息', {
        dangerouslyUseHTMLString: true
      });
    },
    //监听pagesize改变的事件(分页里面）
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getSchoolTeacherList();
    },
    //监听页码值，改变的事件(分页里面）
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getSchoolTeacherList();
    },
    //监听switch开关状态的改变
    async userStateChanged(userinfo) {
      const {data: res} = await this.$http.put(`/delesteach/${userinfo.steachId}/${userinfo.delflag}`);
      this.$message.success("更新删除状态成功！")
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
    addUser() {//这里有问题
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return ;//表单预验证没通过
        //可以发起添加用户的网络请求
          let {data:res}=await this.$http.get('insertst',
              {
                  params: {
                      steachNumber: this.addForm.steachNumber,
                      steachPassword: this.addForm.steachPassword,
                      steachName: this.addForm.steachName,
                      steachSex: this.addForm.steachSex,
                      steachEmail:this.addForm.steachEmail,
                      steachTel:this.addForm.steachTel,
                      coname:this.addForm.coname,
                      roleid:this.addForm.roleid
                  }
              });
          if(res==="success"){
              this.$message.success('添加教师成功！');
              this.addDialogVisible=false;//添加成功之后，把添加用户对话框关闭
              this.getSchoolTeacherList();//重新获取列表
          }else if(res==="again"){
              this.$message.error('添加教师失败，该职工号已存在，请再认真检查！');
          }else{
              this.$message.error('添加教师失败！');
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
      this.addForm.coname=val;//这里得到的是id
    },
    //弹出编辑页面
    async showEditDialog(id){
      /*console.log(id)*/
      let {data:res} = await this.$http.get('getTs',
              {
                params: {
                  id: id
                }
              });
      this.editForm=res;
      this.editDialogVisible=true//显示编辑页面
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
    editUser(){
      this.$refs.editFormRef.validate( async valid => {
        if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
        //否则发起修改用户的请求
        const {data: res} = await this.$http.put(`/updatesteach/${this.editForm.steachId}/${this.editForm.steachNumber}/${this.editForm.steachPassword}/${this.editForm.steachName}
        /${this.editForm.steachEmail}/${this.editForm.coId}/${this.editForm.steachSex}/${this.editForm.steachTel}`);
        if(res.vueStatus!=="again"){
            this.editDialogVisible=false;//添加成功之后，把修改用户对话框关闭
            this.getSchoolTeacherList();//重新获取列表
            this.$message.success("更新教师信息成功！")
        }else{
            this.$message.error("更新教师信息失败，该职工号已存在，请认真核对信息！")
        }

      })
    },
    //展示分配角色的对话框
    async setRole(stinfo){
      this.stinfo=stinfo;
      //在展示对话框之前获取所有的角色列表
      const result = await this.$http.get('/role/getAllRolesInST');
      if (result.status !== 200) return this.$message.error('获取权限列表失败！');
      this.rolesList = result.data;
      this.setRoleDialogVisible=true
    },
    //点击确定按钮,分配角色
    async saveRoleChange(){
        //什么都没选的情况
      if(!this.selectRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const {data: res} = await this.$http.put(`/updatestrole/${this.stinfo.steachId}/${this.selectRoleId}`);
      this.$message.success("教师分配角色成功！")
      this.getSchoolTeacherList();
      this.setRoleDialogVisible=false;
      this.selectRoleId=null

    }
  }
}
</script>

<style lang="less" scoped>
    .roleeditdialog{
        font-size: 16px;
    }
</style>
