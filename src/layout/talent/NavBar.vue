<!--
 * @Author: truxcoder
 * @Date: 2022-03-17 14:05:55
 * @LastEditTime: 2022-03-17 15:03:53
 * @LastEditors: truxcoder
 * @Description: 人才库顶部导航栏
-->

<template>
  <div class="navbar">
    <div class=" flex justify-between items-center px-4 w-full">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/talent' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="flex items-end">
        <!-- <el-avatar shape="square" :size="40" class=" w-10 h-10" fit="fill" :src="photo" /> -->
        <img :src="photo" class="w-10 h-10 rounded-md" alt="">

        <el-dropdown class="ml-1">
          <span class="el-dropdown-link">
            <i class="el-icon-caret-bottom" />
          </span>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                首页
              </el-dropdown-item>
            </router-link>
            <router-link target="_blank" :to="{ path: '/perdetail', query: { id: id } }">
              <el-dropdown-item>
                个人详情
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>

      </div>

    </div>
  </div>

</template>

<script>
const defaultSettings = require('@/settings.js')
export default {
  name: 'NavBar',
  computed: {
    title() {
      return this.$route?.meta?.title
    },
    photo() {
      return defaultSettings.staticURL + 'photo/mini/' + this.$store.getters.avatar
    },
    id() {
      return this.$store.getters.id
    }
  }

}
</script>

<style scoped>
.navbar {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  @apply h-12 flex items-center;
}

</style>
