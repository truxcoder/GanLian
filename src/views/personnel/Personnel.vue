<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="警号/工号" prop="policeCode">
        <el-input v-model="formInline.policeCode" size="small" placeholder="警号/工号" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formInline.name" size="small" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="单位" prop="organId">
        <el-select v-model="formInline.organId" size="small" placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button type="success" :disabled="true" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">添加</el-button>
      <el-button v-if="total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
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
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="警号/工号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.policeCode }}
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.organShortName }">{{ scope.row.organShortName ? scope.row.organShortName : '未定义' }}</span>
          <!-- <span :class="{'text_red':!scope.row.organId}">{{ scope.row.organId ? getOrganName(scope.row.organId, "short") : '未定义' }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="110" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: isBirthdayZero(scope.row.birthday) }">{{ scope.row.birthday | ageFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.nation }}
        </template>
      </el-table-column>
      <el-table-column label="政治面貌" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.political }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <!-- <personnel-add :form-visible="addFormVisible" :organ-list="organList" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" /> -->
    <personnel-update :form-visible="updateFormVisible" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import remoteDepartmentData from '@/api/departmentData.json'
import { personnelList, personnelDelete } from '@/api/personnel'
import { common_mixin } from '@/common/mixin/mixin'
// import { department_mixin } from '@/common/mixin/department'
import { getAge } from '@/utils/index'
// import PersonnelAdd from './PerAdd'
import PersonnelUpdate from './PerUpdate'

export default {
  name: 'Personnel',
  components: { PersonnelUpdate },
  filters: {
    ageFilter(age) {
      return getAge(dayjs(age).format('YYYY-MM-DD'))
    }
  },
  mixins: [common_mixin],
  data() {
    return {
      searchData: {},
      originData: [],
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
      pageSize: 10,
      count: 0,
      formInline: {
        name: '',
        policeCode: '',
        organId: ''
      }
    }
  },
  computed: {
    currentPageData: {
      get: function() {
        return this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      set: function(newValue) {
        // const originValue = this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        // Object.assign(originValue[this.currentEditIndex], newValue)
        // originValue[this.currentEditIndex] = newValue
        this.$set(this.currentPageData, this.currentEditIndex, newValue)
      }
    },
    // currentPageData(){
    //   return this.currentData.slice((this.currentPage-1)*this.pagesize, this.currentPage*this.pagesize)
    // },
    organList() {
      return this.$store.getters.organs
    },
    queryMeans() {
      return this.$store.state.settings.queryMeans
    },
    total() {
      return this.queryMeans === 'frontend' ? this.currentData.length : this.count
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.fetchData()
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      personnelList(data, params).then(response => {
        // if (this.queryMeans === "frontend" || response.count) {
        //   this.originData = response.data
        //   this.currentData = [...this.originData]
        //   this.count = response.count
        // }
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePrint(index, row) {
      // console.log(index, row)
      this.rowData = row
      // this.currentEditIndex = index
      this.dialogPrintVisible = true
    },
    handleDetail(index, row) {
      const routeUrl = this.$router.resolve({
        path: '/perdetail',
        query: { id: row.id }
      })
      window.open(routeUrl.href, '_blank')
      // this.$router.push({ path: 'pdetail' })
    },
    handleAllData() {
      // this.queryMeans === 'backend' ? this.fetchData() : (this.currentData = [...this.originData])
      if (this.queryMeans === 'backend') {
        this.searchData = {}
        this.currentPage = 1
        this.fetchData()
      } else {
        this.currentData = [...this.originData]
      }
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
          personnelDelete({ id: [id] })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.originData.splice(index, 1)
              this.currentData.splice(index, 1)
              if (this.queryMeans === 'backend') {
                this.count--
              }
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
          personnelDelete({ id: this.multipleSelection.map(item => item.id) })
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
    onSearch() {
      const searchData = {}
      let searchParamNumber = 0
      for (const key in this.formInline) {
        if (this.formInline[key] !== '') {
          searchData[key] = this.formInline[key]
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
      this.$refs.searchForm.resetFields()
      this.searchData = searchData
      this.currentPage = 1
      this.fetchData(searchData)
    },
    printVisibleChange() {
      this.dialogPrintVisible = false
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
      // if (this.queryMeans === "backend") {
      //   this.$set(this.currentData,this.currentEditIndex,{...row})
      // } else{
      //   this.$set(this.currentPageData,this.currentEditIndex,{...row})
      // }

      this.fetchData(this.searchData)
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      if (this.queryMeans === 'backend') {
        this.fetchData(this.searchData)
      }
    },
    isBirthdayZero(birthday) {
      return dayjs(birthday).year() === 1
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
