<template><!--模板区-->
    <div class="login_container">
      <div class="login_box">
        <!--头像区域-->
        <div class="avatar_box">
          <img src="../assets/loginphoto/logo.jpg" alt="HRBULogo">
        </div>
        <!--登录表单区域-->
        <!--表单数据绑定1.先给form表单加：model，2.给每一个input项加一个v-model3.在行为区定义数据对象-->
        <!--v-model是为了完成数据绑定-->
        <!--表单验证1.给表单添加一个:rules2.给验证的item项绑定一个prop(这里有一个坑，prop绑定的类要与v-model相同)3.在行为区定义验证规则-->
        <!--ref是生成表单的引用对象，绑定各种函数-->
        <el-form ref="loginFromLogin" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
          <!--用户名-->
          <el-form-item prop="username"><!--prop是为了加入表单验证规则-->
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" placeholder="用户名/学号/职工号/邮箱号/手机号"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="info" @click='forgetPassword'>忘记密码</el-button>
            <el-button type="danger" @click="login">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>/*行为区*/
export default {
  name: 'Login',
  data: function () {
    return {
      //这是登录表单数据的绑定对象
      loginForm: {
        username: '',/*这里可以设默认值*/
        password: ''
      },
      //
      queryInfo: {}
      ,
      //这是表单的验证规则对象
      loginFormRules: {
        username: [
          {required: true, message: '请输入登录名称', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 15 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login () {//登录前预验证            如果某个方法的返回值是promise可以通过await和async来简化数据
      this.$refs.loginFromLogin.validate(async valid => {//=》是回调函数，valid是布尔类型的返回值,true是验证通过
        if(!valid) return ;
        const {data: res,config: con}=await this.$http.get('login',
                {
                  params: {
                    username: this.loginForm.username,
                    password: this.loginForm.password
                  }
                });//除了data数据，其他5个都不需要,{}把data解析出来，重命名为res
        if(res.errCode!==10000){
          return this.$message.error('登陆失败，用户名或密码错误');
        }else{
          this.$message.success('登陆成功');
          //1.将登陆成功之后的token，保存在客户端的sessionStorage中（会话期间的存储机制，当前网页打开期间保存）
          //    1.1项目中除了登陆之外的其他api接口，必须在登陆之后才能访问
          //   1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem('token',res.data);
          window.sessionStorage.setItem('username',this.loginForm.username);
          window.sessionStorage.setItem('password',this.loginForm.password);
          //2.通过编程式导航跳转到后台主页，路由地址是。。。。。
          if(this.loginForm.username!=='admin'){//这里管理员只给了admin这一个账号
            this.$router.push('/personindex').catch(err=>{});
          }else{
            this.$router.push('/home').catch(err=>{});
          }
        }
      })
    },
    forgetPassword(){
      this.$message.error('请私下联系管理员');
    }
  }
}
</script>

<style lang="less" scoped>/*样式区，加scoped是为了不影响其他页面的样式，意为单组件,样式生效区间*/
.login_container{
  background-image: url("../assets/loginphoto/login_back.jpg");
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 3px;//圆角边框
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);//为了让头像盒子在最中间
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;//把边框线变成圆角
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;//距离左侧
    transform: translate(-50%,-50%);//让盒子居中间往上
    background-color: #ffffff;
    img{
      width: 100%;
      height: 100%;//让图片充满盒子
      border-radius: 50%;//让图片变成圆角
      background-color: #eee;
    }
  }
}
.btns{
  display: flex;//变成一个弹性模型
  justify-content: flex-end;/*居右对齐*/
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 40px;//距离上下0，左右40px
  box-sizing: border-box;/*处理盒子溢出*/
}
</style>
