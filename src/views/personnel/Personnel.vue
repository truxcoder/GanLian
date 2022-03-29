<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-if="can.global" label="单位" prop="organId">
        <el-select v-model="searchForm.organId" :style="formItemWidth" size="small" placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="警号/工号" prop="policeCode">
        <el-input v-model="searchForm.policeCode" :style="formItemWidth" size="small" placeholder="警号/工号" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name" :style="formItemWidth" size="small" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="级别" prop="level">
        <el-select v-model="searchForm.level" :style="formItemWidth" size="small" placeholder="请选择级别" multiple>
          <el-option v-for="i in levelList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success" size="small" icon="el-icon-search" @click="searchVisible = true">高级查询</el-button>
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
      :fit="true"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center" width="120">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.organShortName }">{{ scope.row.organShortName ? scope.row.organShortName : '未定义' }}</span>
          <!-- <span :class="{'text_red':!scope.row.organId}">{{ scope.row.organId ? getOrganName(scope.row.organId, "short") : '未定义' }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.departmentShortName }">{{ scope.row.departmentShortName ? scope.row.departmentShortName : '未定义' }}</span>
          <!-- <span :class="{'text_red':!scope.row.organId}">{{ scope.row.organId ? getOrganName(scope.row.organId, "short") : '未定义' }}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="name" />
      <el-table-column align="center" label="身份" width="70">
        <template slot-scope="scope">
          {{ scope.row.userType === 1 ? '民警' : '辅警' }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="警号/工号" prop="policeCode" :show-overflow-tooltip="true" />
      <el-table-column label="性别" prop="gender" width="60" align="center" />
      <el-table-column label="年龄" width="60" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: isBirthdayZero(scope.row.birthday) }">{{ scope.row.birthday | ageFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" prop="nation" width="90" align="center" />
      <el-table-column label="政治面貌" prop="political" align="center" width="120" />
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button> -->
          <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
    <PersonnelEdit :visible="editVisible" :action="action" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />

    <!-- <personnel-update :visible="updateVisible" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" /> -->
    <personnel-search :visible="searchVisible" :can="can" @advanceSearch="advanceSearch" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import remoteDepartmentData from '@/api/departmentData.json'
import { request } from '@/api'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'

import { permission_mixin } from '@/common/mixin/permission'
import PersonnelSearch from './PersonnelSearch'
// import PersonnelUpdate from './PerUpdate'
import PersonnelEdit from './PerEdit.vue'

export default {
  name: 'Personnel',
  components: { PersonnelEdit, PersonnelSearch },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'personnel',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      searchVisible: false,
      levelList: [],
      formItemWidth: { width: '180px' },
      searchForm: {
        name: '',
        policeCode: '',
        organId: '',
        level: ''
      }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.check().then(() => {
      this.fetchData()
      this.fetchOtherData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      if (!Object.keys(data).includes('organId')) {
        data = { ...data, ...this.defaultSearchData }
      } else if (data.organId === '') {
        data.organId = this.defaultSearchData.organId ?? ''
      }
      request('personnel', 'list', data, params).then(response => {
        if (response.count) {
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
      })
    },
    fetchOtherData() {
      request('level', 'list').then(res => {
        this.levelList = res.data ?? []
      })
    },
    handleDetail(index, row) {
      const url = this.$router.resolve({
        path: '/perdetail',
        query: { id: row.id }
      })
      window.open(url.href, '_blank')
      // this.$router.push({ path: 'pdetail' })
    },
    advanceSearch(data) {
      this.searchData = data
      this.currentPage = 1
      this.searchVisible = false
      this.fetchData(data)
    },
    isBirthdayZero(birthday) {
      return dayjs(birthday).year() === 1
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request('personnel', 'delete', { id: [id] })
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
    onClean() {
      this.$refs.searchForm.resetFields()
      this.$set(this.searchForm, 'level', '')
      // this.queryParam = {}
      this.isClean = true
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
