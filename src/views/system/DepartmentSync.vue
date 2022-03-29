<!--
 * @Author: truxcoder
 * @Date: 2022-01-19 14:15:53
 * @LastEditTime: 2022-03-15 10:30:26
 * @LastEditors: truxcoder
 * @Description: 数据同步页面
-->
<template>
  <div v-loading="loading" class="app-container">
    <div class="tool-bar">
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleSyncData">同步数据</el-button>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="增加的数据">
        <department-list v-if="addData.length" :passed="addData" :tab="'add'" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
      <el-tab-pane label="更新的数据">
        <department-list v-if="updateData.length" :passed="updateData" :tab="'update'" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
      <el-tab-pane label="删除的数据">
        <department-list v-if="deleteData.length" :passed="deleteData" :tab="'delete'" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { permission_mixin } from '@/common/mixin/permission'

import DepartmentList from '@/views/system/DepartmentList.vue'

export default {
  name: 'DepartmentSync',
  components: { DepartmentList },
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      resource: 'data',
      queryMeans: 'frontend',
      addData: [],
      updateData: [],
      deleteData: [],
      loading: false
    }
  },
  computed: {
    organs() {
      return this.$store.getters.organs
    },
    departments() {
      return this.$store.getters.departments
    },
    organMap() {
      const map = {}
      this.organs.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    departmentMap() {
      const map = {}
      this.departments.forEach(item => {
        map[item.id] = item
      })
      return map
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
  },
  methods: {
    handleSyncData() {
      this.loading = true
      request('data', 'department_sync').then(response => {
        this.addData = response.add ?? []
        this.updateData = response.update ?? []
        this.deleteData = response.delete ?? []
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
</style>
