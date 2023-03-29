<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../../assets/Backstagephoto/hrbu.png" class="backlogo" style="width: 170px">
        <span>实习指导平台后台管理系统</span>
      </div>
      <div>
        <el-dropdown @command="handleCommand">
          <i class="el-icon-user-solid" style="margin-right: 15px;background-color: #ffffff;size: 30px;"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1" style='min-width: 30px'><i class="el-icon-thumb"></i>修改密码</el-dropdown-item>
            <el-dropdown-item command="2" style='min-width: 30px' divided><i class="el-icon-thumb"></i>首页</el-dropdown-item>
            <el-dropdown-item command="3" style='min-width: 30px' divided><i class="el-icon-thumb"></i>退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        {{username}}
      </div>
    </el-header>
    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' :'200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--左侧菜单内容-->
        <!--动态绑定布尔值，取消折叠动画-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                 :unique-opened="true"  :collapse="isCollapse" :collapse-transition="false" :router="true" default-active="activePath">
          <!--一级菜单-->
          <el-submenu index="7">
            <template slot="title"><i class="el-icon-s-tools"></i><span>权限管理</span></template>
            <el-menu-item index="roles" @click="saveNavState('/roles')"><i class="el-icon-menu"></i>角色维护</el-menu-item>
            <el-menu-item index="permission" @click="saveNavState('/permission')"><i class="el-icon-menu"></i>权限列表</el-menu-item>
          </el-submenu>

          <el-submenu index="1"><!--index相同的话，点一个下拉菜单会同时展开很多个-->
            <!--一级菜单的模板区-->
            <template slot="title"><i class="iconfont icon-icon-test" style="margin-right: 10px;"></i><span>学生管理</span></template>
            <el-menu-item index="student" @click="saveNavState('/student')"><i class="el-icon-menu"></i>学生维护</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-custom"></i><span>学校教师管理</span></template>
            <el-menu-item index="schoolteacher" @click="saveNavState('/schoolteacher')"><i class="el-icon-menu"></i>教师维护</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-s-check"></i><span>实训管理</span></template>
            <el-menu-item index="trainingcompany" @click="saveNavState('/trainingcompany')"><i class="el-icon-menu"></i>实训企业维护</el-menu-item>
            <el-menu-item index="trainingteacher" @click="saveNavState('/trainingteacher')"><i class="el-icon-menu"></i>企业教师维护</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-truck"></i><span>实习管理</span></template>
            <el-menu-item index="internshipcompany" @click="saveNavState('/internshipcompany')"><i class="el-icon-menu"></i>实习公司维护</el-menu-item>
            <el-menu-item index="internshipInfo" @click="saveNavState('/internshipInfo')"><i class="el-icon-menu"></i>学生实习维护</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-s-comment"></i><span>新闻管理</span></template>
            <el-menu-item index="backnew" @click="saveNavState('/backnew')"><i class="el-icon-menu"></i>新闻维护</el-menu-item>
          </el-submenu>

          <el-submenu index="8">
            <template slot="title"><i class="el-icon-s-data"></i><span>数据统计</span></template>
            <el-menu-item index="report" @click="saveNavState('/report')"><i class="el-icon-menu"></i>用户分类</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!--右侧内容主体区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <div>
      <!--修改密码的对话框-->
      <el-dialog title="修改密码"
                 :visible.sync="updateAdminPasswordDialogVisible"
                 width="40%"
                 @close="updateAdminPasswordDialogClosed"><!--重置表单-->
        <!--内容主体区-->
        <el-form :model="updateForm" :rules="updateFormrules" ref="updateFormRef" label-width="120px">
          <el-form-item label="当前的管理员：" >
            <el-input v-model="updateForm.adminname" disabled></el-input>
          </el-form-item>
          <el-form-item label="旧密码：" >
            <el-input v-model="updateForm.password" disabled></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input v-model="updateForm.newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="newPasswordAgain">
            <el-input v-model="updateForm.newPasswordAgain" show-password></el-input>
          </el-form-item>
        </el-form>
        <!--底部按钮区-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="updateAdminPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAdminPassword">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </el-container>

</template>

<script>
export default {
  name: 'Home',
  data () {
    // 重复密码验证
    const pwdAgainCheck = async(rule, value, callback) => {
              if (value.length < 1) {
                this.changeAgainFlag = 2;
                return callback(new Error('重复密码不能为空！'));
              } else if (this.updateForm.newPassword !== this.updateForm.newPasswordAgain) {
                this.changeAgainFlag = 2;
                return callback(new Error('两次输入密码不一致！'));
              } else {
                this.changeAgainFlag = 1;
                callback()
              }
            };
    return {
      changeAgainFlag: 0,
      username: '',
      password:'',
      newpassword:'',
      isCollapse: false,//默认为不折叠
      activePath:'',//保存被激活的链接
      //控制对话框
      updateAdminPasswordDialogVisible:false,
      //管理员数据对象,为了修改密码
      admininfo:{},
      updateForm:{
        adminname:'',
        password:'',
        newPassword:'',
        newPasswordAgain:''
      },
      updateFormrules:{
        newPassword:[
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 15 个字符', trigger: 'blur'}
        ],
        newPasswordAgain:[
          { required: true, validator: pwdAgainCheck, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.username=window.sessionStorage.getItem('username');
    this.password=window.sessionStorage.getItem('password');
    this.updateForm.adminname=window.sessionStorage.getItem('username');
    this.updateForm.password=window.sessionStorage.getItem('password');
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    //控制下拉菜单的点击事件
    handleCommand(command) {
      if(command==='1'){
        this.updateAdminPasswordDialogVisible=true
      }else if (command==='2'){
        /*window.sessionStorage.clear();*/
        this.$router.push('/index');
      }else if (command==='3'){//退出功能的原理就是销毁token
        window.sessionStorage.clear();
        this.$router.push('/login');//跳转到其他页面
        this.$message.success('退出系统成功！');
      }
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath=activePath;
    },
    //点击确定修改管理员密码
    updateAdminPassword(){
      /*先表单预验证*/
      this.$refs.updateFormRef.validate(async valid=>{//表单预验证
        if(!valid) return;//表单预验证没通过
        this.newpassword=this.updateForm.newPasswordAgain;
        let {data:res}=await this.$http.get('admin/updateadminpassword',
                {
                  params: {
                    username: this.username,
                    password: this.password,
                    newpassword: this.newpassword
                  }
                });
        if(res==="success"){
          this.$message.success('管理员修改密码成功！');
          this.updateAdminPasswordDialogVisible=false
          window.sessionStorage.clear();
          this.$router.push('/login');//跳转到其他页面
        }else{
          this.$message.error('管理员修改密码失败！');
        }
      })
    },
    updateAdminPasswordDialogClosed(){
      this.$refs.updateFormRef.resetFields()//重置表单
    }
  }
}
</script>
<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{//element-ui中每一个组件都可以作为一个类名
  background-color: #373D41;
  display: flex;
  justify-content: space-between;//组件左右贴边
  /*padding-left: 0;*/
  align-items: center;//所有div居中，和上下不贴边
  color: #ffffff;
  font-size: 20px;//文本大小
  > div{//左侧div嵌套
    display: flex;
    align-items: center;//在纵向上居中对齐
    span{
      margin-left: 10px;/*文本和logo之间有间隔*/
    }
  }
}
.el-aside{
  background-color: #333744;
  .el-menu {
    border-right: none;//解决菜单边框问题
  }
}
.el-main{
  background-color: #eaedf1;
}
.backlogo{
  height: 20%;
  width: 30%;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;//让三个竖线之间有间隔
  cursor: pointer;
}
</style>
