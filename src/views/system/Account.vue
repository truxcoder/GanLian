<template>
  <div id="account-container" class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-if="can.global" label="单位" prop="organId">
        <el-select v-model="searchForm.organId" :style="formItemWidth" size="small" placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name" :style="formItemWidth" size="small" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="登录名" prop="username">
        <el-input v-model="searchForm.username" :style="formItemWidth" size="small" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="searchForm.userType" :style="formItemWidth" size="small" placeholder="请选择用户类型">
          <el-option v-for="i in userTypeList" :key="i.value" :label="i.label" :value="i.value" />
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
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="queryMeans === 'backend' ? currentData : currentPageData"
      element-loading-text="Loading"
      stripe
      border
      row-class-name="normal-row"
      :fit="true"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.organShortName }">{{ scope.row.organShortName ? scope.row.organShortName : '未定义' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.departmentShortName }">{{ scope.row.departmentShortName ? scope.row.departmentShortName : '未定义' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="name" />
      <el-table-column align="center" label="身份">
        <template slot-scope="scope">
          {{ scope.row.userType === 1 ? '民警' : '借调民警' }}
        </template>
      </el-table-column>
      <el-table-column label="登录名" prop="username" align="center" />
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
  </div>
</template>

<script>
import { request } from '@/api'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'Personnel',
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'account',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      searchVisible: false,
      levelList: [],
      formItemWidth: { width: '170px' },
      searchForm: {
        name: '',
        organId: '',
        userType: '',
        username: ''
      }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    userTypeList() {
      return [{ label: '民警', value: 1 }, { label: '借调民警', value: 12 }]
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      request('account', 'list', data, params).then(response => {
        if (response?.count) {
          this.originData = response.data
          this.currentData = [...this.originData]
          this.count = response.count
          this.listLoading = false
        } else {
          this.originData = []
          this.currentData = []
          this.count = 0
          this.listLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    onClean() {
      this.$refs.searchForm.resetFields()
      this.isClean = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
// #account-container ::v-deep .normal-row {
//   height: 10px!important;
//   line-height: 10px!important;
//   padding: 0!important;
// }
// .myfont {
//   @extend .iconfont;
// }
</style>
