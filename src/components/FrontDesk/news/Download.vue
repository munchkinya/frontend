<template>
  <div class="download-class">
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>其他</el-breadcrumb-item><!--这里写死了-->
      <el-breadcrumb-item>下载专区</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="news-list">
      <span>敬请期待</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.download-class{
  background-color: #FFFFFF;
  color: #333;
  text-align: center;
  line-height: 160px;
  .news-list{
    border: 2px solid #9A0102;
    border-width: 2px 0 0 0;
    /*padding-top: 10px;*/
  }
}
</style>