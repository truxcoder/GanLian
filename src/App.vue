<!--
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-03-30 18:37:36
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.el-table th.gutter{
    display: table-cell!important;
  }

.el-button [class*=jd-]+span {
    margin-left: 5px;
}

</style>
