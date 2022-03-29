<!--
 * @Author: truxcoder
 * @Date: 2021-11-11 17:03:21
 * @LastEditTime: 2022-03-24 11:36:10
 * @LastEditors: truxcoder
 * @Description: 机构编制数管理
-->
<template>
  <div class="app-container">
    <div class="tableZone">
      <el-table
        v-loading="listLoading"
        :data="queryMeans === 'backend' ? currentData : currentPageData"
        element-loading-text="Loading"
        stripe
        :fit="true"
        highlight-current-row
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="全称" prop="name" width="250" />
        <el-table-column align="center" label="简称" prop="shortName" />
        <el-table-column align="center" label="编制数">
          <template slot-scope="scope">
            <span v-if="currentEditIndex !== scope.$index">{{ scope.row.headcount }}</span>
            <el-input v-else v-model.number="headcount" size="mini" class=" w-20" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="已占用">
          <template slot-scope="scope">
            {{ getUse(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="剩余">
          <template slot-scope="scope">
            <el-tag v-if="getUse(scope.row) > scope.row.headcount" type="danger" size="small">超编{{ getUse(scope.row) - scope.row.headcount }}</el-tag>
            <span v-else>{{ scope.row.headcount - getUse(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="can.manage && can.global" align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="currentEditIndex === scope.$index" size="mini" type="primary" @click="onUpdateSubmit(scope.$index, scope.row)">确定</el-button>
            <el-button v-if="currentEditIndex !== scope.$index" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'Headcount',
  mixins: [common_mixin, list_mixin, permission_mixin, search_mixin],
  data() {
    return {
      resource: 'department',
      queryMeans: 'frontend',
      originData: [],
      currentData: [],
      organMap: {},
      currentEditIndex: -1,
      headcount: 0,
      totalCount: 0,
      searchForm: { personnelId: '', organId: '', years: '', season: '', conclusion: '' },
      searchItemWidth: { width: '130px' }
    }
  },
  computed: {
  },
  created() {
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans)
      request('department', 'headcount', data, params).then(response => {
        if (response.data) {
          this.originData = response.data
          this.totalCount = response.total
          this.currentData = [...this.originData]
        } else {
          this.originData = []
          this.currentData = []
        }
        this.listLoading = false
      })
    },
    onUpdateSubmit(index, row) {
      if (this.headcount === row.headcount) {
        this.$message.info('未更改数据')
        this.resetUpdateForm()
        return false
      }
      const data = { id: row.id, headcount: this.headcount }
      this.dialogLoading = true
      request('department', 'update', data).then(response => {
        this.$message.success(response.message)

        // this.$set(this.currentData, index + (this.currentPage - 1) * this.pageSize, this.headcount)
        const current = this.currentData[index + (this.currentPage - 1) * this.pageSize]
        this.$set(current, 'headcount', this.headcount)
        // this.$set(this.currentData, index + (this.currentPage - 1) * this.pageSize, current)
        this.resetUpdateForm()
        this.dialogLoading = false
      })
        .catch(err => {
          console.log(err)
          this.resetUpdateForm()
          this.dialogLoading = false
        })
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      if (this.currentEditIndex !== -1) {
        this.$message.error('一次只能编辑一条信息！')
        return
      }
      this.currentEditIndex = index
      this.headcount = row.headcount
    },
    resetUpdateForm() {
      this.headcount = 0
      this.currentEditIndex = -1
    },
    getUse(row) {
      if (row?.id === '68d1150ddfa247f8a129589a6d4dfbbd') {
        return this.totalCount
      }
      return row.use
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
