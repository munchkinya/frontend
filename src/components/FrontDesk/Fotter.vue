<template>
    <div class="index_footer">
        <div class="footerleft">
            <div class="left1">
                <img src="../../assets/Backstagephoto/hrbu.png" >
            </div>
            <div class="left2">
                @Copyright @2020-2021 哈尔滨学院学生指导服务中心
            </div>
            <div class="left3">
                技术支持：哈尔滨学院信息工程学院
            </div>
        </div>
        <div class="footerright">
            <div class="right1">
                <el-link href="http://www.hrbu.edu.cn/" type="danger">哈尔滨学院官网</el-link>
            </div>
            <div class="right2">
                地址：黑龙江省哈尔滨市南岗区中兴大道109号
            </div>
            <div class="right3">
                邮编：150000
            </div>
            <div class="right4">
                邮箱：2605257300@qq.com
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Fotter"
    }
</script>

<style lang="less" scoped>
.index_footer{
    width: 100%;
    background-color: #212121;
    color: #8FAEAE;
    display: flex;
    justify-content: space-between;//组件左右贴边
    margin-top: 20px;
    border: 2px solid #9A0102;
    border-width: 2px 0 0 0;
    .footerleft{
        .left1{
            display: flex;
            align-items: center;
            margin-left: 70px;
            padding-top: 10px;
            img{
                height: 40px;
                weight: 40px;
            }
        }
        .left2{
            margin: 10px 0 0 60px;
        }
        .left3{
            margin: 10px 0 0 65px;
            padding-bottom: 10px;
        }
    }
    .footerright{
        margin: 0 150px 0 0;
        text-align: right;
        .right1{
            margin: 5px 10px 0 0px;
        }
        .right2{
            margin: 10px 10px 0 0px;
        }
        .right3{
            margin: 10px 10px 0 0px;
        }
        .right4{
            margin-top: 7px;
            padding-bottom: 5px;
        }
    }
}
</style>
