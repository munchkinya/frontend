<template>
    <div>
        <el-card>
            <el-page-header @back="goBack" content="详情页面">
            </el-page-header>
            <div class="news">
                <div class="title">
                    <span v-html="newinfo.title"></span>
                </div>
                <el-divider></el-divider>
                <div>
                    <div v-html="newinfo.body"></div>
                </div>
                <div class="newsfotter">
                    <div class="left">

                    </div>
                    <div class="right">
                        <div class="right1">发布时间：{{datatime}}</div>
                        <div class="right2">发布人：{{newinfo.publisher}}</div>
                    </div>
                </div>
            </div>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Newdetail",
        data(){
            return{
                id:'',
                newinfo:[],
                datatime:null,
            }
        },
        methods: {
            goBack() {
                //返回新闻列表
                this.$router.go(-1)
            },
            async getNewByid(){
                let {data:res}=await this.$http.get('news/getbyid',
                    {
                        params: {
                            id: this.id
                        }
                    });
                this.newinfo=res;
                this.datatime=this.dateFormat1(this.newinfo.publishtime)
            },
            dateFormat1(data1) {
                var date = new Date(data1);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "年" + month + "月" + day+"日");
            },
        },
        mounted: function () {
            //得到新闻id
            this.id = this.$route.params.id;
            this.getNewByid();
        }
    }
</script>

<style lang="less" scoped>
.title{
    text-align: center;
    font-size: 20px;
    font-weight:bold;
    .p{
        display: inline-block;

        vertical-align: middle;
    }
}
.newsfotter{
    display: flex;
    justify-content: space-between;//组件左右贴边
    .right1{
        margin: 10px 10px 0 0px;
    }
    .right2{
        margin: 10px 10px 0 0px;
    }
}
</style>
