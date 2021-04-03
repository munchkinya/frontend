<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>登录流量</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    //1.导入echarts
    import echarts from "echarts";
    import _ from "lodash";
    export default {
        name: "Trainteacherreport.vue",
        //生命周期函数的时候渲染，不能在create里面，会报错，得等到dom渲染成功之后
        async mounted() {
            // 3.基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            /*await this.$http.get()*/
            //4.准备数据和配置项
            var option = {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };
            //5.展示数据
            myChart.setOption(option);

        }
    }
</script>

<style scoped>

</style>
