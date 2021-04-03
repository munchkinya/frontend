<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>数据统计</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>学院实习地点统计</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;margin-left: 50px"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from "echarts";
    export default {
        name: "Location",
        //生命周期函数的时候渲染，不能在create里面，会报错，得等到dom渲染成功之后
        async mounted() {
            // 3.基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            let result=await this.$http.get("/admin/location",{
                params:{
                    username:window.sessionStorage.getItem('username')
                }
            });
            let datas=[]
            for(let i=0;i<result.data.length;i++){
                datas.push({'value':result.data[i].num,'name':result.data[i].name})
            }
            //4.准备数据和配置项
            var option = {
                series : [
                    {
                        name: '实习地点统计图',
                        type: 'pie',
                        radius: '55%',
                        data:datas,
                        roseType: 'angle',
                        itemStyle: {
                            normal: {
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                    }
                ]
            };
            //5.展示数据
            myChart.setOption(option);
        }
    }
</script>

<style scoped>

</style>
