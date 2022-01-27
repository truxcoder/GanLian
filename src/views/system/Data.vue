<!--
 * @Author: truxcoder
 * @Date: 2022-01-19 14:15:53
 * @LastEditTime: 2022-01-19 17:39:45
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
        <div v-if="addData.length" class=" mb-4 text-red-500">
          <span class=" pr-4">以下为大数据平台新增的数据。确定同步添加到数据库?</span>
          <el-button type="danger" plain size="mini" @click="onAdd">确定</el-button>
        </div>
        <data-list v-if="addData.length" :passed="addData" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
      <el-tab-pane label="更新的数据">
        <div v-if="updateData.length" class=" mb-4 text-red-500">
          <span class=" pr-4">以下为大数据平台更新的数据。确定同步更新到数据库?</span>
          <el-button type="danger" plain size="mini" @click="onUpdate">确定</el-button>
        </div>
        <data-list v-if="updateData.length" :passed="updateData" :organ-map="organMap" :department-map="departmentMap" />
      </el-tab-pane>
      <el-tab-pane label="删除的数据">
        <div v-if="deleteData.length" class=" mb-4 text-red-500">
          <span class=" pr-4">以下为大数据平台删除的数据。确定同步从数据库删除?</span>
          <el-button type="danger" plain size="mini" @click="onDelete">确定</el-button>
        </div>
        <data-list v-if="deleteData.length" :passed="deleteData" :organ-map="organMap" :department-map="departmentMap" />
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
          request('data', 'sure', { id: this.deleteData.map(item => item.userId) }, { method: 'delete' })
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
