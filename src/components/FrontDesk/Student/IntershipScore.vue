<template>
    <div class="block">
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>实习成绩</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-row :gutter="20">
            <el-col :span="8" :offset="7">
                    <el-card style="height: 350px">
                        <span class="demonstration" style="margin-left: 110px;font-size: 20px">实习成绩</span>
                        <el-rate style="margin-top: 30px;margin-left: 90px;margin-bottom: 50px"
                                v-model="score"
                                :colors="colors"
                                 disabled>
                        </el-rate>
                        <span style="margin-left: 130px;font-size: 20px;color: #F56C6C;margin-bottom: 40px">{{texts[score]}}</span>
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
                score: 0,
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                texts:['你没有实习成绩','不及格','及格','中等','良好','优秀'],
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
                if(result.data.intershipscore==='1'){
                    this.score=1
                }else if(result.data.intershipscore==='2'){
                    this.score=2
                }else if(result.data.intershipscore==='3'){
                    this.score=3
                }else if(result.data.intershipscore==='4'){
                    this.score=4
                }else if(result.data.intershipscore==='5'){
                    this.score=5
                }else{
                    this.score=0
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
