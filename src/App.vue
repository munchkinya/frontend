<template>
  <div id="app">
    <div v-if="$route.meta.keepAlive">
      <Head></Head>
      <router-view></router-view>
      <Footer></Footer>
    </div>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  import Head from './components/FrontDesk/Head'
  import Footer from './components/FrontDesk/Fotter'
export default {
  name: 'app',
  components: {
    Head,
    Footer
  }
}
</script>

<style lang="less" scoped>
.v-content{
  height: 100%;
}
</style>
