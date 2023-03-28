<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item><!--这里写死了-->
      <el-breadcrumb-item>学生维护</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--栅格系统-->
      <el-row :gutter="20"><!--搜索框和按钮之间的间隔-->
        <el-col :span="12"><!--宽度-->
          <el-input placeholder="请输入想查询的学生姓名" v-model="queryInfo.query" class="input-with-select" clearable
                    @clear="getStudentList">
            <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加学生</el-button>
        </el-col>
      </el-row>
      <!--:data为表格绑定一个数据源，prop为每一列表示渲染的数据对象-->
      <el-table :data="studentList" border stripe>
        <!--label每一列的标题-->
        <el-table-column type="index" label="#" min-width="60"></el-table-column>
        <el-table-column prop="stuNumber" label="学号" min-width="120"></el-table-column>
        <el-table-column prop="stuName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="stuSex" label="性别" min-width="80"></el-table-column>
        <el-table-column prop="stuEmail" label="电子邮箱" min-width="180"></el-table-column>
        <el-table-column prop="stuTel" label="联系电话" min-width="120"></el-table-column>
        <el-table-column prop="collagename" label="所在院系" min-width="150"></el-table-column>
        <el-table-column prop="grade" label="年级" min-width="100"></el-table-column>
        <el-table-column prop="majorname" label="行政专业" min-width="150"></el-table-column>
        <el-table-column prop="adminclassname" label="行政班级" min-width="150"></el-table-column>
        <el-table-column prop="directname" label="专业方向" min-width="150"></el-table-column>
        <el-table-column prop="directclassname" label="方向班级" min-width="150"></el-table-column>
        <el-table-column prop="schoolteachername" label="校内指导教师" min-width="150"></el-table-column>
        <el-table-column prop="trainteachername" label="校外指导教师" min-width="150"></el-table-column>
        <el-table-column prop="traincomname" label="实训企业" min-width="150"></el-table-column>
        <el-table-column prop="delflag" label="状态（默认未删除）" min-width="150">
          <template slot-scope="scope"><!--{{scope.row}}可得到当前行的所有信息-->
            <!--{{scope.row}}--><!--0代表没被删除，1代表删除-->
            <el-switch
                    :active-value="0"
                    :inactive-value="1"
                    v-model="scope.row.delflag" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope"><!--//作用域插槽-->
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.stuId)"></el-button>

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
      <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主体区-->
        <el-form :model="studentaddForm" :rules="studentaddFormrules" ref="studentaddFormRef" label-width="130px">
          <el-form-item label="学号" prop="stuNumber">
            <el-input v-model="studentaddForm.stuNumber"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="stuPassword">
            <el-input v-model="studentaddForm.stuPassword"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="stuName">
            <el-input v-model="studentaddForm.stuName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="stuSex">
            <el-radio-group v-model="studentaddForm.stuSex">
              <el-radio border label="男"></el-radio>
              <el-radio border label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="stuEmail">
            <el-input v-model="studentaddForm.stuEmail"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="stuTel">
            <el-input v-model="studentaddForm.stuTel"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model.number="studentaddForm.grade" placeholder="格式XXXX,例如：2017"></el-input>
          </el-form-item>
          <!--级联选择器-->
          <el-form-item label="学院/专业/班级" prop="selectedOptions1">
            <el-cascader
                    :change-on-select="true"
                    :props="defaultParams"
                    :options="options1"
                    v-model="studentaddForm.selectedOptions1"
                    :clearable="true"
                    placeholder="学院/专业/班级"
                    @change="handleChange1(studentaddForm.selectedOptions1)">
            </el-cascader>
          </el-form-item>
          <el-form-item label="实训详细信息" prop="selectedOptions2">
            <el-cascader
                    :change-on-select="true"
                    :props="defaultParams"
                    :options="options2"
                    v-model="studentaddForm.selectedOptions2"
                    :clearable="true"
                    placeholder="学院/公司/方向/班级/教师"
                    @change="handleChange2(studentaddForm.selectedOptions2)">
            </el-cascader>
          </el-form-item>
          <el-form-item label="校内指导老师" prop="selectedOptions3">
            <el-cascader
                    :change-on-select="true"
                    :props="defaultParams"
                    :options="options3"
                    v-model="studentaddForm.selectedOptions3"
                    :clearable="true"
                    placeholder="学院/教师"
                    @change="handleChange3(studentaddForm.selectedOptions3)">
            </el-cascader>
          </el-form-item>
        </el-form>
        <!--底部按钮区-->
        <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
                </span>
      </el-dialog>

      <!--修改用户的对话框-->
      <el-dialog
              title="修改学生"
              :visible.sync="editstudentDialogVisible"
              width="50%" @close="editstudentDialogClosed">
        <el-form :model="editstuForm" :rules="editstuFormRules" ref="editstuFormRef" label-width="130px">
          <el-form-item label="学号" prop="stuNumber">
            <el-input v-model="editstuForm.stuNumber"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="stuPassword">
            <el-input v-model="editstuForm.stuPassword"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="stuName">
            <el-input v-model="editstuForm.stuName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="stuSex">
            <el-radio-group v-model="editstuForm.stuSex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="stuEmail">
            <el-input v-model="editstuForm.stuEmail"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="stuTel">
            <el-input v-model="editstuForm.stuTel"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model.number="editstuForm.grade" placeholder="格式XXXX,例如：2017"></el-input>
          </el-form-item>
          <!--级联选择器-->
          <el-form-item label="学院/专业/班级" prop="selectedOptions1">
            <el-cascader
                    :change-on-select="true"
                    :props="defaultParams"
                    :options="options1"
                    v-model="editstuForm.selectedOptions1"
                    :clearable="true"
                    placeholder="学院/专业/班级"
                    @change="handleChange1(editstuForm.selectedOptions1)">
            </el-cascader>
          </el-form-item>
          <el-form-item label="实训详细信息" prop="selectedOptions2">
            <el-cascader
                    :change-on-select="true"
                    :props="defaultParams"
                    :options="options2"
                    v-model="editstuForm.selectedOptions2"
                    :clearable="true"
                    placeholder="学院/公司/方向/班级/教师"
                    @change="handleChange2(editstuForm.selectedOptions2)">
            </el-cascader>
          </el-form-item>
          <el-form-item label="校内指导老师" prop="selectedOptions3">
            <el-cascader
                    :change-on-select="true"
                    :props="defaultParams"
                    :options="options3"
                    v-model="editstuForm.selectedOptions3"
                    :clearable="true"
                    placeholder="学院/教师"
                    @change="handleChange3(editstuForm.selectedOptions3)">
            </el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button @click="editstudentDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
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
        queryInfo:{
          query:'',
          pagenum:1,//默认从第一页
          pagesize:5//默认五条一页
        },
        studentList:[],
        total:0,//为了分页显示的时候
        addDialogVisible:false,
        studentaddForm:{},
        options1:[],
        //三个级联选择器的公共模板
        //级联选择器模板值
        defaultParams: {
          label: 'name',
          value: 'id',
          children: 'children'
        },
        options2:[],
        options3:[],
        studentaddFormrules:{
          stuNumber:[
            {required: true, message: '请输入学号', trigger: 'blur'}
          ],
          stuPassword:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          stuName:[
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          stuSex:[
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          stuEmail:[
            {required: true, message: '请输入电子邮箱', trigger: 'blur'},
            {validator:checkEmail,trigger: 'blur'}
          ],
          stuTel:[
            {required: true, message: '请输入联系方式', trigger: 'blur'},
            {validator:checkMobile,trigger: 'blur'}
          ],
          grade:[
            {  required: true, message: '请输入年级', trigger: 'blur' },
            { type: 'number', message: '请输入数字，格式如：2017', trigger: 'blur' }
          ],
          selectedOptions1:[
            {required: true, message: '请选择专业/班级', trigger: 'blur'}
          ],
          selectedOptions2:[
            {required: true, message: '请选择实训详细信息', trigger: 'blur'}
          ],
          selectedOptions3:[
            {required: true, message: '请选择校内指导老师', trigger: 'blur'}
          ]
        },
        selectedOptions11:[],
        selectedOptions22:[],
        selectedOptions33:[],
        editstudentDialogVisible:false,
        editstuForm:{},
        editstuFormRules:{
          stuNumber:[
            {required: true, message: '请输入学号', trigger: 'blur'}
          ],
          stuPassword:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          stuName:[
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          stuSex:[
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          stuEmail:[
            {required: true, message: '请输入电子邮箱', trigger: 'blur'},
            {validator:checkEmail,trigger: 'blur'}
          ],
          stuTel:[
            {required: true, message: '请输入联系方式', trigger: 'blur'},
            {validator:checkMobile,trigger: 'blur'}
          ],
          grade:[
            {  required: true, message: '请输入年级', trigger: 'blur' },
            { type: 'number', message: '请输入数字，格式如：2017', trigger: 'blur' }
          ],
          selectedOptions1:[
            {required: true, message: '请选择专业/班级', trigger: 'blur'}
          ],
          selectedOptions2:[
            {required: true, message: '请选择实训详细信息', trigger: 'blur'}
          ],
          selectedOptions3:[
            {required: true, message: '请选择校内指导老师', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getStudentList();
      this.getProductType()
    },
    methods:{
      async getStudentList() {//必须要在data定义参数
        const result = await this.$http.get('student/getallstudents',
                {
                  params: {
                    query: this.queryInfo.query,
                    pageNum: this.queryInfo.pagenum,
                    pageSize: this.queryInfo.pagesize
                  }
                });
        if (result.status !== 200) return this.$message.error('获取用户列表失败！');
        //如果没有return，说明获取成功了，那就保存导data中
        this.studentList = result.data.list;
        this.total = result.data.total;
      },
      //监听pagesize改变的事件(分页里面）
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getStudentList();
      },
      //监听页码值，改变的事件(分页里面）
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getStudentList();
      },
      //监听switch开关状态的改变
      async userStateChanged(userinfo) {
        const {data: res} = await this.$http.put(`/student/delestudent/${userinfo.stuId}/${userinfo.delflag}`);
        this.$message.success("更新删除状态成功！")
      },
      //监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.studentaddFormRef.resetFields();
      },
      //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
      addTodo() {
        this.$refs.studentaddFormRef.validate( async valid => {
          if(!valid) return ;//表单预验证没通过
          //可以发起添加用户的网络请求
          let {data:res}=await this.$http.get('student/insertstudent',
                  {
                    params: {
                      stuNumber: this.studentaddForm.stuNumber,
                      stuPassword: this.studentaddForm.stuPassword,
                      stuName: this.studentaddForm.stuName,
                      stuSex: this.studentaddForm.stuSex,
                      stuEmail:this.studentaddForm.stuEmail,
                      stuTel:this.studentaddForm.stuTel,
                      grade:this.studentaddForm.grade,
                      selectedOptions1:this.selectedOptions11,
                      selectedOptions2:this.selectedOptions22,
                      selectedOptions3:this.selectedOptions33
                    }
                  });
          if(res==="success"){
            this.$message.success('添加学生成功！');
            this.addDialogVisible=false;//添加成功之后，把添加用户对话框关闭
            this.getStudentList();//重新获取列表
          }else if(res==="again"){
            this.$message.error('添加学生失败，该学号已存在，请再认真检查！');
          }else{
            this.$message.error('添加学生失败！');
          }
        })
      },
      //得到级联选择器所有的值
      getProductType(){
        this.$http.get("student/getselectedOptions1")
                .then(res=>{
                  // 将获得到的数据赋值给options
                  this.options1=res.data;
                });
        this.$http.get("student/getselectedOptions2")
                .then(res=>{
                  // 将获得到的数据赋值给options
                  this.options2=res.data;
                });
        this.$http.get("student/getselectedOptions3")
                .then(res=>{
                  // 将获得到的数据赋值给options
                  this.options3=res.data;
                });
      },
      //得到级联选择器中选中的值
      handleChange1(val){
        this.selectedOptions11=val;
      },
      handleChange2(val){
        this.selectedOptions22=val;
      },
      handleChange3(val){
        this.selectedOptions33=val;
      },
      //弹出编辑页面
      async showEditDialog(id){
        let {data:res} = await this.$http.get('student/getstudentbyid',
                {
                  params: {
                    id: id
                  }
                });
        this.editstuForm=res;
        /*那三个级联选择器要单独赋值*/
        this.editstuForm.selectedOptions1=[res.collegeId,res.majorId,res.adId];
        this.editstuForm.selectedOptions2=[res.collegeId,res.traincomid,res.directinfo,res.dclassId,res.tteachid];
        this.editstuForm.selectedOptions3=[res.collegeId,res.steachid];
        this.editstudentDialogVisible=true//显示编辑页面
      },
      //监听修改用户对话框的关闭事件
      editstudentDialogClosed(){
        this.$refs.editstuFormRef.resetFields();
      },
      //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
      editUser(){
        this.$refs.editstuFormRef.validate( async valid => {
          if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
          //否则发起修改用户的请求
          const {data: res} = await this.$http.put(`/student/updatestudent/${this.editstuForm.stuId}
          /${this.editstuForm.stuNumber}/${this.editstuForm.stuPassword}
        /${this.editstuForm.stuName}/${this.editstuForm.stuSex}/${this.editstuForm.stuEmail}
        /${this.editstuForm.stuTel}/${this.editstuForm.selectedOptions1[2]}/${this.editstuForm.selectedOptions2[3]}/${this.editstuForm.selectedOptions3[1]}
        /${this.editstuForm.selectedOptions2[4]}/${this.editstuForm.grade}`);
          if(res.vueStatus!=="again"){
            this.editstudentDialogVisible=false;//添加成功之后，把修改用户对话框关闭
            this.getStudentList();//重新获取列表
            this.$message.success("更新学生信息成功！")
          }else {
            this.$message.error("更新学生信息失败,该学号已存在，请认真核对信息！")
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
