<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">
        添加
      </el-button>
      <el-button v-if="count" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">
        删除
      </el-button>
      <el-button v-if="count" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">
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
      <el-table-column label="奖励类型" align="center">
        <template slot-scope="scope">
          {{ options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="奖励项/等级" align="center">
        <template slot-scope="scope">
          {{ options.grade[scope.row.grade - 1] && options.grade[scope.row.grade - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="奖励时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.getTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="奖励文号" align="center">
        <template slot-scope="scope">
          {{ scope.row.docNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">
            删除
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
    <award-add :form-visible="addFormVisible" :options="options" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <award-update :form-visible="updateFormVisible" :options="options" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
  </div>
</template>

<script>
import { awardList, awardDelete } from '@/api/award'
import { common_mixin } from '@/common/mixin/mixin'

import AwardAdd from './AwardAdd'
import AwardUpdate from './AwardUpdate'

export default {
  name: 'Award',
  components: { AwardAdd, AwardUpdate },
  mixins: [common_mixin],
  data() {
    return {
      currentData: [],
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
      const categoryOptions = [
        { label: '年度奖励', value: 1 },
        { label: '专项表彰', value: 2 }
      ]
      const gradeOptions = [
        { label: '授予称号', value: 1 },
        { label: '一等功', value: 2 },
        { label: '二等功', value: 3 },
        { label: '三等功', value: 4 },
        { label: '嘉奖', value: 5 },
        { label: '国家级', value: 6 },
        { label: '省部级', value: 7 },
        { label: '市厅级', value: 8 },
        { label: '局级', value: 9 },
        { label: '所级', value: 10 }
      ]
      return {
        category: categoryOptions,
        grade: gradeOptions
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      awardList({}).then(response => {
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
          awardDelete({ id: [id] })
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
          awardDelete({ id: this.multipleSelection.map(item => item.id) })
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
