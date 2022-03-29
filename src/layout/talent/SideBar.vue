<!--
 * @Author: truxcoder
 * @Date: 2022-03-17 10:41:37
 * @LastEditTime: 2022-03-17 20:20:37
 * @LastEditors: truxcoder
 * @Description: 人才库侧边栏
-->

<template>
  <div class="sidebar">
    <div class="logo">
      <img v-if="logo" :src="logo" class="" />
      <div class="title">{{ title }}</div>
    </div>
    <el-menu
      default-active="2"
      class="menu"
      background-color="#285577"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="1" :route="router.dashboard">
        <i class="el-icon-menu" />
        <span slot="title">控制台</span>
      </el-menu-item>
      <el-menu-item index="2" :route="router.politics">
        <i class="el-icon-s-flag" />
        <span slot="title">政工人才库</span>
      </el-menu-item>
      <el-menu-item index="3" :route="router.finance">
        <i class="el-icon-s-check" />
        <span slot="title">财务人才库</span>
      </el-menu-item>
      <el-menu-item index="4" :route="router.information">
        <i class="el-icon-platform-eleme" />
        <span slot="title">信息化人才库</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import router from './router'
export default {
  name: 'SideBar',
  data() {
    return {
      router,
      title: '四川戒毒人才库',
      logo: 'http://30.29.2.6:8686/static/img/homelogo.png'
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }

}
</script>

<style scoped>
.sidebar {
  /* background: #545c64; */
  /* border-right: 1px solid #e6e6e6; */
  background-color: #285577;
  @apply h-screen
}
.logo {
  border-right: 1px solid #e6e6e6;
  background-color: #aa4439;
  @apply h-12 text-yellow-50 flex items-center pl-2
}
.logo img {
  width: 32px;
  height: 32px;
}
.title {
  padding-left: 10px;
  font-size: 1.1rem;
  font-weight:600;
}
.menu {
  height: calc(100vh - 48px);
}

</style>
