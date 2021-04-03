<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>数据统计</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>学院实习薪资统计</el-breadcrumb-item>
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
        name: "Salary",
        //生命周期函数的时候渲染，不能在create里面，会报错，得等到dom渲染成功之后
        async mounted() {
            // 3.基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            let result=await this.$http.get("/admin/salary",{
                params:{
                    username:window.sessionStorage.getItem('username')
                }
            });
            //4.准备数据和配置项
            var option = {
                title: {
                    text: '实习薪资统计图'
                },
                tooltip: {},
                legend: {
                    data:['人数']
                },
                xAxis: {
                    data: [result.data[0].name,result.data[1].name,result.data[2].name,result.data[3].name
                        ,result.data[4].name,result.data[5].name]
                },
                yAxis: {},
                series: [{
                    name: '人数',
                    type: 'line',
                    data: [result.data[0].num,result.data[1].num,result.data[2].num,result.data[3].num
                        ,result.data[4].num,result.data[5].num]
                }]
            };
            //5.展示数据
            myChart.setOption(option);
        }
    }
</script>

<style scoped>

</style>
