<template>
    <div class="index_container">
        <!--走马灯区-->
        <el-carousel :interval="4000" type="card" height="350px">
            <el-carousel-item v-for="item in newslist" :key="item.notice_id">
                <h3 class="medium">
                    <el-image
                            ref="imgh"
                            style="width: 100%; height: 100%"
                            :src="'http://localhost:8888/data/slideshowicons/'+item.slideimgname"
                            fit="scale-down" @click="todonews(item.notice_id)">
                    </el-image>
                </h3>
            </el-carousel-item>
        </el-carousel>
        <!--新闻区-->
        <!--主体区-->
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content bg-purple_left">
                    <div class="notice_head">
                        <span>新闻要点</span>
                    </div>
                    <el-table :data="studentnews" :show-header="false" :cell-style="changestyle" style="margin: 0"
                              @row-click="handle">
                        <el-table-column prop="title" width="408px"  show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple_center">
                    <div class="notice_center">
                        <span>通知公告</span>
                    </div>
                    <el-table :data="poticenews" :show-header="false" :cell-style="changestyle1" style="margin: 0"
                              @row-click="handle">
                        <el-table-column prop="title" width="408px"  show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple_right">
                    <div class="notice_head">
                        <span>招聘信息</span>
                    </div>
                    <el-table :data="internews" :show-header="false" :cell-style="changestyle" style="margin: 0"
                              @row-click="handle">
                        <el-table-column prop="title" width="408px"  show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <!--快速通道区域-->
        <div class="fast_path">
            <div class="mainbg" style="margin-left: 200px">
                <img src="../../assets/loginphoto/logo.jpg">
                <el-link href="http://www.hrbu.edu.cn/" type="danger">学校官网</el-link>
            </div>
            <div class="mainbg">
                <img src="../../assets/icon/hayuanapp.png">
                <el-link href="http://www.hrbu.edu.cn/info/1301/16419.htm" type="danger">哈院APP</el-link>
            </div>
            <div class="mainbg">
                <img src="../../assets/icon/jiaowuxitong.png">
                <el-link href="http://jwmis.hrbu.edu.cn/" type="danger">教务系统</el-link>
            </div>
            <div class="mainbg">
                <img src="../../assets/icon/jiuyexinxi.png">
                <el-link href="https://www.hljbys.org.cn/school/index?mark=hrbu" type="danger">就业信息</el-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Index",
        data(){
            return{
                newslist:[],
                studentnews:[],
                poticenews:[],
                internews:[]
            }
        },
        methods:{
            async getSlideshownews(){
                const result=await this.$http.get('news/getslideshownews');
                this.newslist=result.data;
            },
            todonews(id){
                this.$router.push({name: "tonewdetil", params: {id: id}})
            },
            changestyle({row, rowIndex}){
                return "border:none !important;background-color:#F5F5F5;"
            },
            changestyle1({row, rowIndex}){
                return "border:none !important;background-color:#FFFFFF;"
            },
            async getNewList(){
                const result=await this.$http.get('news/getstudentnewsindex');
                this.studentnews=result.data;
            },
            async getPricelist(){
                const result=await this.$http.get('news/selectallpoticenews');
                this.poticenews=result.data;
            },
            async getinterlist(){
                const result=await this.$http.get('news/getinternewsindex');
                this.internews=result.data;
            },
            handle(row, column, event){
                this.$router.push({name: "tonewdetil", params: {id: row.notice_id}})
            }
        },
        mounted() {
            this.getSlideshownews();
            this.getNewList()
            this.getPricelist()
            this.getinterlist()
        }
    }
</script>

<style lang="less" scoped>
.index_container {
    background-color: #ffffff;
    height: 100%;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 350px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
/*新闻卡片区*/
.el-row {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    padding-left: 50px;
    padding-right: 50px;
    &:last-child {
        margin-bottom: 0;
    }
    .notice_head{
        background-color: #9A0000;
        border: 1px solid;
        height: 50px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        span{
            margin-left: 185px;/*文本和logo之间有间隔*/
        }
    }
    .notice_center {
        background-color: #6E6E6E;
        border: 1px solid;
        height: 50px;
        color: #FFFFFF;
        display: flex;
        align-items: center;

        span {
            margin-left: 185px; /*文本和logo之间有间隔*/
        }
    }
}
.el-col {
    border-radius: 4px;//把边框线变成圆角
}
.bg-purple_left {
    background: #F5F5F5;
}
.bg-purple_center {
    background: #FFFFFF;
}
.bg-purple_right {
    background: #F5F5F5;
}
.grid-content {
    border-radius: 4px;
    min-height: 300px;
}
.fast_path{
    background-color: #9A0000;
    height: 100px;
    div{
        float: left;
        margin-right: 200px;
    }
    .mainbg{
        height: 75px;
        width: 75px;
        img{
            height: 75px;
            width: 75px;
        }
    }
}
</style>
