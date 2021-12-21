<template>
  <div v-loading="listLoading" class="app-container user-container">
    <el-col :span="12">
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
        <!-- <div class="user-tool-bar">
        <el-button type="success" @click="addFormVisible = true" icon="el-icon-circle-plus-outline" size="mini">添加</el-button>
        <el-button type="danger"  icon="el-icon-delete" @click="deleteMutiData" size="mini">删除</el-button>
        <el-button type="primary"  icon="el-icon-s-data" @click="fetchData({})" size="mini">所有数据</el-button>
      </div> -->
      </el-card>
    </el-col>
  </div>
</template>

<script>
import DepartmentTree from '@/components/department/DepartmentTree.vue'
import { getDepartmentList } from '@/api/department'
export default {
  name: 'Department',
  components: { DepartmentTree },
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
