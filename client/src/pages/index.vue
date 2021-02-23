<template>
  <div class="index">
    <hello-world></hello-world>
    <div class="wrapper">
      <router-link to="/detail/1" class="author">链接</router-link>
    </div>
  </div>
</template>

<script>
import HelloWorld from '../components/hello-world'
export default {
  name: 'Index',
  components: {
    HelloWorld,
  },
}
</script>

<style scoped lang="less">
h2 {
  font-weight: normal;
}
.wrapper {
  .author {
    text-align: center;
  }
}
</style>
