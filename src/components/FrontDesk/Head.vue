<template>
    <div class="index_header">
        <div class="headerleft">
            <img src="../../assets/Backstagephoto/hrbu.png" >
        </div>
        <div class="headerright">
            <div class="right1">
                <span @click="toindex">首页</span>
            </div>
            <div class="right2">
                <el-dropdown>
                    <span class="el-dropdown-link" style="font-size: 20px">学生<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="tonews">相关新闻</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">实习报告</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">排行榜</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="right3">
                <el-dropdown>
                    <span class="el-dropdown-link" style="font-size: 20px">教师<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="tonews">相关新闻</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">学生相关</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">实习统计</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="right4">
                <el-dropdown>
                    <span class="el-dropdown-link" style="font-size: 20px">实训企业<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="tonews">相关新闻</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">企业教师</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">相关学生</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="right5">
                <el-dropdown>
                    <span class="el-dropdown-link" style="font-size: 20px">实习公司<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="tonews">相关新闻</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">招聘发布</el-dropdown-item>
                        <el-dropdown-item @click.native="tologin">学生简历</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="right6">
                <span style="color: #9A0000">|</span>
                <span style="cursor: pointer" @click="tologin">  Login</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Head",
        methods:{
            toindex(){
                this.$router.push('/index').catch((e) => {});
            },
            tologin() {
                this.$router.push('/login').catch((e) => {});
            },
            //跳转到新闻
            tonews() {
                this.$router.push('/index_news');
            }
        }
    }
</script>

<style lang="less" scoped>
.index_header{
    width: 100%;
    height: 90px;
    color: #6F6F6F;
    border: 2px solid #9A0102;
    border-width: 0 0 2px 0;
    display: flex;
    justify-content: space-between;//组件左右贴边
    align-items: center;
    font-size: 20px;
    .headerleft{
        img{
            height: 70px;
            weight: 30px;
            margin: 0px 0 0 30px;
            padding: 10px 0 10px 0;
        }
    }
    .headerright{
        margin: 0;
        .right1{
            float: left;
            height: 100%;
            margin-right: 100px;
            span{
                cursor: pointer;
            }
            span:hover{
                color: #9A0000;
            }
        }
        .right2{
            float: left;
            height: 100%;
            margin-right: 100px;
        }
        .right3{
            float: left;
            height: 100%;
            margin-right: 100px;
        }
        .right4{
            float: left;
            height: 100%;
            margin-right: 100px;
        }
        .right5{
            float: left;
            height: 100%;
            margin-right: 100px
        }
        .right6{
            float: left;
            height: 100%;
            margin-right: 100px;
            span{
                cursor: pointer;
            }
            span:hover{
                color: #9A0000;
            }
        }
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #6F6F6F;
    }
    .el-dropdown-link:hover {
        color: #9A0000;
    }
    .el-icon-arrow-down {
        font-size: 16px;
    }
}

</style>
