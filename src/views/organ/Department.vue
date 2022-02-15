<!--
 * @Author: truxcoder
 * @Date: 2021-12-06 10:31:44
 * @LastEditTime: 2022-02-07 18:33:53
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div v-loading="listLoading" class="app-container user-container">
    <!-- <el-col :span="12">
      <el-card class="left-card">
        <el-row :gutter="20">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="addFormVisible = true">编辑</el-button>
        </el-row>
        <el-row :gutter="20">
          <department-tree />
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="right-card">
      </el-card>
    </el-col> -->
    <department-transfer />
  </div>
</template>

<script>
// import DepartmentTree from '@/components/department/DepartmentTree.vue'
import DepartmentTransfer from '@/components/Personnel/PersonnelTransfer.vue'
import { getDepartmentList } from '@/api/department'
export default {
  name: 'Department',
  // components: { DepartmentTree },
  components: { DepartmentTransfer },
  data() {
    return {
      list: [],
      listLoading: false,
      currentEditData: {},
      isOrderChange: false,
      editFormVisible: false,
      addFormVisible: false,
      expandAll: false,
      horizontal: false,
      collapsable: true,
      dragging: false
      // treeData:{},
    }
  },
  methods: {
    fetchData(params = {}) {
      getDepartmentList({}).then(response => {
        // this.list  = response.data.filter(item => item.isentity === 1 )
        this.list = response.data
      })
    },
    updateDataSuccess(row) {
      this.editFormVisible = false
      this.fetchData()
    }
  }
}
</script>

<style scoped></style>
