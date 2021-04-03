<template>
    <el-container class="person-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="../../assets/Backstagephoto/hrbu.png" class="backlogo" style="width: 170px">
                <span>实习指导平台</span>
            </div>
            <div>
                <el-dropdown @command="handleCommand">
                    <i class="el-icon-user-solid" style="margin-right: 15px;background-color: #ffffff;size: 30px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="2"><i class="el-icon-thumb"></i>首页</el-dropdown-item>
                        <el-dropdown-item command="3"><i class="el-icon-thumb"></i>退出系统</el-dropdown-item>
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
                <!--左侧菜单内容-->                                                                       <!--动态绑定布尔值，取消折叠动画-->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                         :unique-opened="true"  :collapse="isCollapse" :collapse-transition="false" :router="true" default-active="activePath">
                    <!--渲染一级菜单-->
                    <el-submenu :index="item.id+'' " v-for="item in role.subMenuList" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-s-unfold"></i>
                            <span>{{item.menuname}}</span>
                        </template>
                        <!--渲染二级菜单-->
                        <el-menu-item :index="item1.path+'' " v-for="item1 in item.subMenuList" :key="item1.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{item1.menuname}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--右侧内容主体区-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    export default {
        name: 'Home',
        data () {
            return {
                changeAgainFlag: 0,
                username: '',
                password:'',
                isCollapse: false,//默认为不折叠
                activePath:'',//保存被激活的链接
                role:{}//用户对应角色的数据对象
            }
        },
        created() {
            this.username=window.sessionStorage.getItem('username');
            this.password=window.sessionStorage.getItem('password');
            this.activePath=window.sessionStorage.getItem('activePath');
            this.getMenuList()//这里是根据登录名和角色对应出角色的权限
        },
        methods: {
            //控制下拉菜单的点击事件
            handleCommand(command) {
                if (command==='2'){
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
            async getMenuList(){
                let {data:res} = await this.$http.get('role/getMenuListByRoleid',
                    {
                        params: {
                            username: this.username,
                            password:this.password
                        }
                    });
                this.role=res;
                window.sessionStorage.setItem('roleId',res.id);
            }
        }
    }
</script>
<style lang="less" scoped>
.person-container{
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
