<!--
 * @Author: truxcoder
 * @Date: 2022-01-19 14:15:53
 * @LastEditTime: 2022-03-30 17:51:26
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
        <data-list v-if="addData.length" :passed="addData" :tab="'add'" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
      <el-tab-pane label="更新的数据">
        <data-list v-if="updateData.length" :passed="updateData" :tab="'update'" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
      <el-tab-pane label="删除的数据">
        <data-list v-if="deleteData.length" :passed="deleteData" :tab="'delete'" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { permission_mixin } from '@/common/mixin/permission'

import DataList from '@/views/system/DataList.vue'

export default {
  name: 'Data',
  components: { DataList },
  filters: {
    userTypeFilter(userType) {
      if (userType === 1) {
        return '民警'
      }
      if (userType === 2) {
        return '辅警'
      }
      return '未定义'
    }
  },
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      resource: 'data',
      queryMeans: 'frontend',
      originData: [],
      currentData: [],
      addData: [],
      updateData: [],
      deleteData: [],
      addCurrentPage: 1,
      pageSize: 10,
      rowSuccessClass: '',
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
      request('data', 'sync').then(response => {
        this.addData = response.add ?? []
        this.updateData = response.update ?? []
        this.deleteData = response.delete ?? []
        this.loading = false
      })
    },
    onAdd() {
      this.$confirm('将同步添加信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          request('data', 'sure', this.addData, { method: 'add' })
            .then(res => {
              this.$message.success(res.message)
              this.addData = []
              this.loading = false
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消添加')
        })
    },
    onUpdate() {
      this.$confirm('将同步更新信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          request('data', 'sure', this.updateData, { method: 'update' })
            .then(res => {
              this.$message.success(res.message)
              this.updateData = []
              this.loading = false
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消更新')
        })
    },
    onDelete() {
      this.$confirm('将同步删除信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          request('data', 'sure', { id: this.deleteData.map(item => item.idCode) }, { method: 'delete' })
            .then(res => {
              this.$message.success(res.message)
              this.deleteData = []
              this.loading = false
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
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
