<!--
 * @Author: truxcoder
 * @Date: 2022-03-17 10:17:24
 * @LastEditTime: 2022-03-17 19:06:09
 * @LastEditors: truxcoder
 * @Description:
-->

<template>
  <el-container class="">
    <el-aside width="230px">
      <SideBar />
    </el-aside>
    <el-main class=" flex-1 p-0">
      <NavBar />
      <section class="p-4">
        <router-view :key="key" />
      </section>
    </el-main>
  </el-container>
</template>

<script>
import SideBar from './SideBar.vue'
import NavBar from './NavBar.vue'
export default {
  name: 'TalentLayout',
  components: { SideBar, NavBar },
  computed: {
    key() {
      return this.$route.path
    }
  }

}
</script>

<style scoped>

</style>
