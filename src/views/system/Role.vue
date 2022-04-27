<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="accountId">
        <AccountOption v-model="searchForm.accountId" size="small" :width="searchItemWidth" />
      </el-form-item>
      <el-form-item label="登录名" prop="username">
        <el-input v-model="searchForm.username" :style="searchItemWidth" size="small" placeholder="登录名" />
      </el-form-item>
      <el-form-item v-if="can.global" label="所属单位" prop="organId">
        <el-select v-model="searchForm.organId" size="small" :style="searchItemWidth" placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
        <!-- <OrganSelect v-model="searchForm.organParam" :multiple="true" :width="searchItemWidth" /> -->
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="searchForm.role" size="small" :style="searchItemWidth" placeholder="请选择角色">
          <el-option v-for="i in roleList" :key="i.name" :label="i.title" :value="i.name" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加用户角色</el-button>
      <el-button v-if="can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除用户角色</el-button>
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
      <!-- <el-button v-if="can.manage" type="primary" icon="el-icon-document" size="mini" @click="dictVisible = true">维护角色字典</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" prop="name" />
      <el-table-column align="center" label="登录名" :show-overflow-tooltip="true" prop="username" />
      <el-table-column align="center" label="角色" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ roleMap[scope.row.role] }}
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center">
        <template slot-scope="scope">
          <span>{{ organMap[scope.row.organId] && organMap[scope.row.organId].shortName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total"
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <RoleEdit :visible="editVisible" :action="action" :options="options" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'
import RoleEdit from './RoleEdit.vue'

import AccountOption from '@/components/Account/AccountOption.vue'

export default {
  name: 'Role',
  components: { RoleEdit, AccountOption },
  mixins: [common_mixin, permission_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'role',
      queryMeans: 'frondEnd',
      originData: [],
      currentData: [],
      dictVisible: false,
      multipleSelection: [],
      searchItemWidth: { width: '180px' },
      searchForm: { accountId: '', organId: '', username: '', role: '' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    roleList() {
      return this.$store.getters.roleDict
    },
    organMap() {
      const map = {}
      this.organList.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    roleMap() {
      const map = {}
      this.$store.getters.roleDict.forEach(item => (map[item.name] = item.title))
      return map
    },
    options() {
      const list = []
      for (const k in this.roleMap) {
        list.push({ label: this.roleMap[k], value: k })
      }
      return { role: list }
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    if (this.$store.getters.roleDict.length === 0) {
      this.$store.dispatch('role/setRoleDict')
    }
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}) {
      this.listLoading = true
      request(this.resource, 'list', data).then(response => {
        this.currentData = response.data || []
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(index, row) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request(this.resource, 'delete', [{ id: row.id, role: row.role }])
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.fetchData()
            })
            .catch(err => {
              // this.$message.error(err.message)
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteMutiData() {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = []
          this.multipleSelection.forEach(item => data.push({ id: item.id, role: item.role }))
          request(this.resource, 'delete', data)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.fetchData()
            })
            .catch(err => {
              // this.$message.error(err.message)
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
