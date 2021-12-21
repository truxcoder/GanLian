<template>
  <div class="container mx-auto .rounded">
    <h1>该页无法找到</h1>
    <a class="border-2 border-blue-500 hover:border-red-500" href="">回到首页</a>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style scoped>

</style>
