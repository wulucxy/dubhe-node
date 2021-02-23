<template>
  <div class="detail">
    <h2>页码：{{ $route.params.id }}</h2>
    <router-link
      :to="{
        name: 'detail',
        params: {
          id: Number($route.params.id) + 1,
        },
      }"
      >下一页</router-link
    >
    <router-link class="link" to="/">回到首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'Detail',
}
</script>

<style scoped lang="less">
h2 {
  font-weight: normal;
}
.detail {
  .link {
    margin: 0 auto;
  }
}
</style>
