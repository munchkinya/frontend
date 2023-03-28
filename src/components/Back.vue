<template>
  <el-container class="backcontainer">
    <el-header>
      <div>
        <img src="../assets/Backstagephoto/hrbu.png" style="width: 170px">
        <span>实习指导平台</span>
      </div>
      <div class="btns">
<!--        <el-button type="danger" @click="toIndex">首页</el-button>-->
        <el-button type="danger" @click="toLogin">用户登录</el-button>
      </div>
    </el-header>
    <el-main>
      <div class="echarts">
        <div :style="{height:'560px',width:'100%'}" ref="myEchart"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import echarts from "echarts";
  import '../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  name: 'Back',
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chinaConfigure();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    toLogin() {
      this.$router.push('/login').catch(err => {});//跳转到其他页面,这里push会跳转异常，因为返回promise对象，没人接
    },
    // toIndex(){
    //   this.$router.push('/index').catch(err => {});//跳转到其他页面
    // },
    //绘制地图
    chinaConfigure() {
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({ // 进行相关配置
        backgroundColor: "#013954",
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        dataRange: {
          show: false,
          min: 0,
          max: 50,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        geo: { // 这个是重点配置区
          map: 'china', // 表示中国地图
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo' // 对应上方配置
        },
          {
            name: '当前省实习人数', // 浮动框的标题
            type: 'map',
            map: 'china',
            geoIndex: 0,
            data: [{
              "name": "北京",
              "value": 49
            }, {
              "name": "上海",
              "value": 34
            }, {
              "name": "黑龙江",
              "value": 44
            }, {
              "name": "深圳",
              "value": 36
            }, {
              "name": "吉林",
              "value": 23
            }, {
              "name": "广东",
              "value": 20
            }, {
              "name": "河南",
              "value": 2
            },{
              "name": "浙江",
              "value": 10
            },{
              "name": "四川",
              "value": 7
            },{
              "name": "新疆",
              "value": 4
            }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  font-size: 20px; //文本大小
  > div { //左侧div嵌套
    display: flex;
    align-items: center; //在纵向上居中对齐
    span {
      margin-left: 10px; /*文本和logo之间有间隔*/
    }
  }
}

.el-main {
  background-color: #eaedf1;
}

.backcontainer {
  height: 100%;
}
</style>
