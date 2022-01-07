<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2021-12-22 15:31:24
 * @LastEditors: truxcoder
 * @Description:组织处理，后端分页
-->
<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <personnel-option :is-clean="isClean" size="small" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="searchForm.category" size="small" placeholder="类别">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理项" prop="grade">
        <el-select v-model="searchForm.grade" size="small" placeholder="请选择处理项">
          <el-option v-for="i in gradeList" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="onClean">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">
        添加
      </el-button>
      <el-button v-if="can.delete && count" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">
        删除
      </el-button>
      <el-button v-if="can.read && count" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">
        所有数据
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.personnelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="警号/工号">
        <template slot-scope="scope">
          {{ scope.row.policeCode }}
        </template>
      </el-table-column>
      <el-table-column label="处理类型" align="center">
        <template slot-scope="scope">
          {{ options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="处理项" align="center">
        <template slot-scope="scope">
          {{ options.grade[scope.row.grade - 1] && options.grade[scope.row.grade - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.getTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="处理文号" align="center">
        <template slot-scope="scope">
          {{ scope.row.docNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="count"
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <punish-add :form-visible="addFormVisible" :options="options" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <punish-update :form-visible="updateFormVisible" :options="options" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
    <punish-detail :visible="detailVisible" :options="options" :row="rowData" @detailClose="detailClose" />
  </div>
</template>

<script>
import { punishList, punishDelete } from '@/api/punish'
import { common_mixin } from '@/common/mixin/mixin'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'

import PunishAdd from './PunishAdd'
import PunishUpdate from './PunishUpdate'
import PunishDetail from './PunishDetail'

export default {
  name: 'Punish',
  components: { PunishAdd, PunishUpdate, PersonnelOption, PunishDetail },
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      searchData: {},
      originData: [],
      currentData: [],
      listLoading: true,
      updateFormVisible: false,
      detailVisible: false,
      addFormVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      currentEditIndex: 0,
      multipleSelection: [],
      rowSuccessClass: '',
      currentPage: 1,
      pageSize: 10,
      count: 0,
      searchForm: { personnelId: '', category: '', grade: '' },
      isClean: false
    }
  },
  computed: {
    options() {
      const categoryOptions = [
        { label: '组织处理', value: 1 },
        { label: '组织教育', value: 2 }
      ]
      const gradeOptions = [
        { label: '停职检查', value: 1 },
        { label: '调整职务', value: 2 },
        { label: '责令辞职', value: 3 },
        { label: '降职', value: 4 },
        { label: '免职', value: 5 },
        { label: '责令检查', value: 6 },
        { label: '批评教育', value: 7 },
        { label: '诫勉', value: 8 }
      ]
      return {
        category: categoryOptions,
        grade: gradeOptions
      }
    },
    gradeList() {
      return this.options.grade.filter(item => {
        let isTrue = true
        switch (this.searchForm.category) {
          case 1:
            isTrue = item.value < 6
            break
          case 2:
            isTrue = item.value > 5
            break
          default:
            isTrue = true
            break
        }
        return isTrue
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      punishList(data, params).then(response => {
        if (response.count) {
          this.originData = response.data
          this.currentData = [...this.originData]
          this.count = response.count
        } else {
          this.originData = []
          this.currentData = []
          this.count = 0
        }
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleAllData() {
      this.searchData = {}
      this.currentPage = 1
      this.fetchData()
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.updateFormVisible = true
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('id:', [id])
          punishDelete({ id: [id] })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.currentData.splice(index, 1)
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
          punishDelete({ id: this.multipleSelection.map(item => item.id) })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.fetchData()
            })
            .catch(err => {
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

    addVisibleChange() {
      this.addFormVisible = false
    },
    updateVisibleChange() {
      this.updateFormVisible = false
    },
    addSuccess() {
      this.addFormVisible = false
      this.fetchData(this.searchData)
    },
    updateSuccess(row) {
      this.updateFormVisible = false
      this.fetchData(this.searchData)
    },
    detailClose() {
      this.detailVisible = false
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.fetchData(this.searchData)
    },
    onPersonnelChange(value) {
      this.searchForm.personnelId = value
      this.isClean = false
    },
    onSearch() {
      const searchData = {}
      let searchParamNumber = 0
      for (const key in this.searchForm) {
        if (this.searchForm[key] !== '') {
          searchData[key] = this.searchForm[key]
          searchParamNumber++
        }
      }
      if (!searchParamNumber) {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！'
        })
        return
      }
      this.searchData = searchData
      this.currentPage = 1
      this.fetchData(searchData)
      this.onClean()
    },
    // 清空搜索框
    onClean() {
      this.$refs.searchForm.resetFields()
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
