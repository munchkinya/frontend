/*全局配置表*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表

import './assets/css/global.css'
//导入阿里图标库样式
import './assets/fonts/iconfont.css'
//全局引入element-ui组件
import ElementUI, {MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
Vue.config.productionTip = false;
//导入ueditor
import '../static/ueditor/ueditor.config';
import '../static/ueditor/ueditor.all'
import '../static/ueditor/lang/zh-cn/zh-cn'
import '../static/ueditor/ueditor.parse'
//引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

//导入axios,挂载组件
import axios from 'axios'
//设置请求的根路径
axios.defaults.baseURL='http://localhost:8888/api/';
//通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config =>{
  config.headers.access_token=window.sessionStorage.getItem('token');
  /*在最后必须return config,固定写法*/
  return config;
  },
    error=>{
      console.log(error);
      Promise.reject(error);
    });
Vue.prototype.$http =axios;
//导入弹框提示组件
import {Message } from 'element-ui'
Vue.prototype.$confirm=MessageBox.confirm;
Vue.prototype.$message=Message;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
