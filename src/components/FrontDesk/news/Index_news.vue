<template>
    <div class="maincontainer">
        <!--图片区-->
        <div class="mainbg">
            <img src="../../../assets/Frontdeskphoto/bg.jpg">
        </div>
        <el-container>
            <el-aside width="250px">

                <el-menu default-active="activePath" :default-openeds="['1','2','3','4']" class="el-menu-vertical-demo"
                         active-text-color="#9A0000" :router="true">
                    <el-submenu index="1">
                        <template slot="title"><span style="color: #FFFFFF;font-size: 20px;height: 20px">新闻公告</span></template>
                        <el-menu-item index="studentnews" @click="saveNavState('/studentnews')">学校相关信息</el-menu-item>
                        <el-menu-item index="poticenews" @click="saveNavState('/poticenews')">实训相关信息</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><span style="color: #FFFFFF;font-size: 20px;height: 20px">就业信息</span></template>
                        <el-menu-item index="pricenews" @click="saveNavState('/pricenews')">实习相关信息</el-menu-item>
                        <el-menu-item index="internews" @click="saveNavState('/internews')">招聘相关信息</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><span style="color: #FFFFFF;font-size: 20px;height: 20px">其他</span></template>
                        <el-menu-item index="download" @click="saveNavState('/download')">下载专区</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Index_news",
        data() {
            return {
                activePath:'',//保存被激活的链接:'
            }
        },
        methods:{
            //保存链接的激活状态
            saveNavState (activePath) {
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath=activePath;
            },
        },
        created() {
            this.activePath=window.sessionStorage.getItem('activePath')
        }
    }
</script>

<style lang="less" scoped>
.maincontainer{
    height: 100%;
    .mainbg{
        height: 400px;
        width: 100%;
        img{
            height: 400px;
            width: 100%;
        }
    }
}
.el-container{
    margin-top: 20px;
    .el-aside {
        /*background-color: #D3DCE6;*/
        color: #333;
        text-align: center;
        line-height: 200px;
        margin-left: 100px;
        .el-menu{
            background-color: #9A0000;
            text-color: #FFFFFF;
            font-size: 18px;
            text-align: left;
            border-right: none;
            .el-menu-item{
                background-color: #F4F4F4;
                font-size: 16px;
            }
        }
        .el-submenu__title{
            padding-left: 0;
        }
        .el-calendar{

        }
    }
    .el-main {

    }
    .el-divider{
        color: #9A0000;
    }
}
</style>
