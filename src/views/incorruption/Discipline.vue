<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-01-06 15:39:28
 * @LastEditors: truxcoder
 * @Description:处分，前端分页
-->
<template>
  <div class="app-container">
    <el-row v-if="!count">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row>
    <el-form v-if="count" ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <personnel-option :is-clean="isClean" size="small" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="searchForm.category" size="small" placeholder="类别">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="处分项" prop="grade">
        <el-select v-model="searchForm.dictId" size="small" placeholder="请选择处理项">
          <el-option v-for="i in disDictList" :key="i.id" :label="i.name" :value="i.id" />
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
      <el-button v-if="can.manage" type="primary" icon="el-icon-document" size="mini" @click="dictVisible = true">维护处分项字典</el-button>
    </div>
    <el-table v-if="count" v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="单位">
        <template slot-scope="scope">
          {{ scope.row.organShortName }}
        </template>
      </el-table-column>
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
      <el-table-column label="处分类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.category && options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="处分项" align="center">
        <template slot-scope="scope">
          {{ scope.row.dictName }}
        </template>
      </el-table-column>
      <el-table-column label="处分时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.getTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="剩余影响期" align="center">
        <template slot-scope="scope">
          {{ scope.row.deadline | deadlineFilter }}
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
    <discipline-add :visible="addFormVisible" :options="options" :dis-dict="disDict" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <discipline-update :visible="updateFormVisible" :options="options" :dis-dict="disDict" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
    <discipline-detail :visible="detailVisible" :options="options" :row="rowData" @detailClose="detailClose" />
    <dis-dict :visible="dictVisible" :list="disDict" :options="options" @dictChange="dictChange" @dictVisibleChange="dictVisibleChange" />
  </div>
</template>

<script>
import { disciplineList, disDictList, disciplineDelete } from '@/api/discipline'
import { common_mixin } from '@/common/mixin/mixin'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'

import DisciplineAdd from './DisciplineAdd'
import DisciplineUpdate from './DisciplineUpdate'
import DisciplineDetail from './DisciplineDetail'
import DisDict from '@/views/incorruption/DisDict.vue'

export default {
  name: 'Discipline',
  components: { DisciplineAdd, DisciplineUpdate, PersonnelOption, DisciplineDetail, DisDict },
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      searchData: {},
      originData: [],
      disDict: [],
      newDisDict: [],

      currentData: [],
      listLoading: true,
      updateFormVisible: false,
      detailVisible: false,
      addFormVisible: false,
      dictVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      currentEditIndex: 0,
      multipleSelection: [],
      rowSuccessClass: '',
      currentPage: 1,
      pageSize: 10,
      searchForm: { personnelId: '', category: '', dictId: '' },
      isClean: false
    }
  },
  computed: {
    count() {
      return this.currentData.length
    },
    options() {
      const categoryOptions = [
        { label: '党纪处分', value: 1 },
        { label: '政务处分', value: 2 }
      ]
      return {
        category: categoryOptions
      }
    },
    disDictList() {
      return this.disDict.filter(item => item.category === this.searchForm.category)
    }
  },
  created() {
    this.fetchAllData()
    disDictList().then(response => {
      this.newDisDict = response.data
      console.log('response:---', response.data)
    })
  },
  methods: {
    fetchAllData(params = {}) {
      this.listLoading = true
      const promises = [disciplineList(params), disDictList()]
      Promise.all(promises).then(responses => {
        this.originData = responses[0].data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []

        this.disDict = responses[1].data
        this.listLoading = false
      })
    },
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      disciplineList(data, params).then(response => {
        this.originData = response.data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []
        this.listLoading = false
      })
    },
    fetchDictData() {
      disDictList().then(response => {
        this.disDict = response.data
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
          disciplineDelete({ id: [id] })
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
          disciplineDelete({ id: this.multipleSelection.map(item => item.id) })
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
    dictVisibleChange() {
      this.dictVisible = false
    },
    addSuccess() {
      this.addFormVisible = false
      this.fetchData(this.searchData)
    },
    updateSuccess(row) {
      this.updateFormVisible = false
      this.fetchData(this.searchData)
    },
    dictChange() {
      this.fetchDictData()
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
