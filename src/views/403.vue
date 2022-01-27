<!--
 * @Author: truxcoder
 * @Date: 2022-01-13 10:39:53
 * @LastEditTime: 2022-01-13 10:40:33
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div class="container mx-auto .rounded">
    <h1>非法用户！</h1>
  </div>
</template>

<script>
export default {
  name: 'Page403',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style scoped></style>
