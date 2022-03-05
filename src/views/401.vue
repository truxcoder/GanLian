<!--
 * @Author: truxcoder
 * @Date: 2022-01-13 10:39:53
 * @LastEditTime: 2022-03-04 15:01:26
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div class="container mx-auto .rounded">
    <div class="text-center h-screen flex text-red-500 font-bold text-6xl pt-20 justify-center">
      你无权查看此人信息!
    </div>
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
