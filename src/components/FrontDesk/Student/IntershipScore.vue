<template>
    <div class="block">
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>实习成绩</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-row :gutter="20">
            <el-col :span="8" >
                    <el-card style="height: 350px">
                        <span class="demonstration" style="margin-left: 50px;font-size: 20px">校内指导教师实习成绩</span>
                        <el-rate style="margin-top: 30px;margin-left: 90px;margin-bottom: 50px"
                                v-model="score1"
                                :colors="colors"
                                 disabled>
                        </el-rate>
                        <span style="margin-left: 130px;font-size: 20px;color: #F56C6C;margin-bottom: 40px">{{texts[score1]}}</span>
                    </el-card>
            </el-col>
            <el-col :span="8" >
                <el-card style="height: 350px">
                    <span class="demonstration" style="margin-left: 70px;font-size: 20px">实习企业实习成绩</span>
                    <el-rate style="margin-top: 30px;margin-left: 90px;margin-bottom: 50px"
                             v-model="score2"
                             :colors="colors"
                             disabled>
                    </el-rate>
                    <span style="margin-left: 130px;font-size: 20px;color: #F56C6C;margin-bottom: 40px">{{texts[score2]}}</span>
                </el-card>
            </el-col>
            <el-col :span="8" >
                <el-card style="height: 350px">
                    <span class="demonstration" style="margin-left: 90px;font-size: 20px">最终实习成绩</span>
                    <el-rate style="margin-top: 30px;margin-left: 90px;margin-bottom: 50px"
                             v-model="score3"
                             :colors="colors"
                             disabled>
                    </el-rate>
                    <span style="margin-left: 130px;font-size: 20px;color: #F56C6C;margin-bottom: 40px">{{texts[score3]}}</span>
                </el-card>
            </el-col>
        </el-row>

    </div>

</template>

<script>
    export default {
        name: "IntershipScore",
        data() {
            return {
                score1: 0,
                score2: 0,
                score3: 0,
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                texts:['教师未录入成绩','不及格','及格','中等','良好','优秀'],
                src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
            }
        },
        methods:{
            async getintershipscore(){
                const result = await this.$http.get('internshipinfo/getstudentscore',
                    {
                        params: {
                            stID: window.sessionStorage.getItem('username'),
                        }
                    });
                if(result.data.intershipscoreone==='1'){
                    this.score1=1
                }else if(result.data.intershipscoreone==='2'){
                    this.score1=2
                }else if(result.data.intershipscoreone==='3'){
                    this.score1=3
                }else if(result.data.intershipscoreone==='4'){
                    this.score1=4
                }else if(result.data.intershipscoreone==='5'){
                    this.score1=5
                }else{
                    this.score1=0
                }
                if(result.data.intershipscoretwo==='1'){
                    this.score2=1
                }else if(result.data.intershipscoretwo==='2'){
                    this.score2=2
                }else if(result.data.intershipscoretwo==='3'){
                    this.score2=3
                }else if(result.data.intershipscoretwo==='4'){
                    this.score2=4
                }else if(result.data.intershipscoretwo==='5'){
                    this.score2=5
                }else{
                    this.score2=0
                }
                if(this.score2 ===0 || this.score1 === 0){
                    this.score3=0
                }else{
                    this.score3= Math.round((this.score1+this.score2)/2);
                }
            }
        },
        created() {
            this.getintershipscore()
        }
    }
</script>

<style scoped>

</style>
