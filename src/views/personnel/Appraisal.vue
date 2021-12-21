<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">添加</el-button>
      <el-button v-if="count" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="count" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <div class="tableZone">
      <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="人员">
          <template slot-scope="scope">
            {{ scope.row.personnelName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="警号/工号">
          <template slot-scope="scope">
            {{ scope.row.policeCode }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核单位">
          <template slot-scope="scope">
            {{ scope.row.organName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核年份">
          <template slot-scope="scope">
            {{ scope.row.years }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核结果">
          <template slot-scope="scope">
            {{ scope.row.conclusion }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    <appraisal-add :form-visible="addFormVisible" :options="options" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <appraisal-update :form-visible="updateFormVisible" :options="options" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
  </div>
</template>

<script>
import { getAppraisalList, appraisalDelete } from '@/api/appraisal'
import { common_mixin } from '@/common/mixin/mixin'

import AppraisalAdd from './AppraisalAdd'
import AppraisalUpdate from './AppraisalUpdate'

export default {
  name: 'Appraisal',
  components: { AppraisalAdd, AppraisalUpdate },

  mixins: [common_mixin],
  data() {
    return {
      currentData: [],
      organMap: {},
      listLoading: true,
      updateFormVisible: false,
      addFormVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      currentEditIndex: 0,
      multipleSelection: [],
      rowSuccessClass: '',
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    count() {
      return this.currentData.length
    },
    options() {
      const years = []
      for (let index = 2010; index < 2030; index++) {
        years.push({ label: index + '年', value: index + '' })
      }
      const conclusion = [
        { label: '优秀', value: '优秀' },
        { label: '称职', value: '称职' },
        { label: '基本称职', value: '基本称职' },
        { label: '不称职', value: '不称职' },
        { label: '不评定等次', value: '不评定等次' }
      ]
      return {
        organ: this.$store.getters.organs,
        years,
        conclusion
      }
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAppraisalList().then(response => {
        this.currentData = response.data
        this.listLoading = false
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleAllData() {
      this.fetchData()
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.updateFormVisible = true
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('id:', [id])
          appraisalDelete({ id: [id] })
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
          appraisalDelete({ id: this.multipleSelection.map(item => item.id) })
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
      this.fetchData()
    },
    updateSuccess(row) {
      this.updateFormVisible = false
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      if (this.queryMeans === 'backend') {
        this.fetchData()
      }
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
