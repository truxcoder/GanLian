<!--
 * @Author: truxcoder
 * @Date: 2022-04-18 15:40:30
 * @LastEditTime: 2022-04-18 17:24:15
 * @LastEditors: truxcoder
 * @Description:
-->

<template>
  <div class="data-list">
    <div v-if="passed.length" class=" mb-4 text-red-500">
      <div>
        <span class=" pr-4">以下为大数据平台{{ act }}的数据。如需同步，请勾选相关数据，然后点击</span>
        <el-button type="danger" plain size="mini" @click="onSubmit">确定</el-button>
      </div>
      <div v-if="tab === 'add'" class="notice">
        <span class=" pr-4">如果您有十分的把握，也可略过审查，直接全部同步。请点击:</span>
        <el-button type="danger" plain size="mini" @click="onSubmitAll">全部更新</el-button>
      </div>
      <div v-if="tab === 'update'" class="mt-4">
        <span class=" pr-4">如果您有十分的把握，也可略过审查，直接全部更新。请点击:</span>
        <el-button type="danger" plain size="mini" @click="onSubmitAll">全部更新</el-button>
      </div>
    </div>
    <el-table :data="currentPageData" element-loading-text="Loading" border :row-class-name="getRowClassName" :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" width="120" prop="realName" />
      <el-table-column align="center" label="身份证号" width="200">
        <template slot-scope="scope">
          <div :class="getIdCodeClassName(scope.row.idCode)"> {{ scope.row.idCode }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录名称" width="150" prop="userName" />
      <el-table-column align="center" label="所属单位" width="120">
        <template slot-scope="scope">
          {{ getOrganName(scope.row.organID) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属部门" width="150">
        <template slot-scope="scope">
          {{ getDepartmentName(scope.row.deptId) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.userType | userTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="本系统ID" prop="id" />
    </el-table>
    <el-pagination
      v-if="total"
      class="pagination"
      background
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import { request } from '@/api/index'
import { idCodeValidate } from '@/utils/validate'

export default {
  name: 'DataList',
  filters: {
    userTypeFilter(userType) {
      if (userType === 1) {
        return '民警'
      }
      if (userType === 12) {
        return '借调民警'
      }
      return '未定义'
    }
  },
  mixins: [common_mixin],
  props: {
    passed: {
      type: Array,
      default() {
        return []
      }
    },
    organMap: {
      type: Object,
      default() {
        return {}
      }
    },
    departmentMap: {
      type: Object,
      default() {
        return {}
      }
    },
    tab: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentData: [],
      currentMap: {},
      currentPage: 1,
      pageSize: 10,
      form: {},
      all: false,
      multipleSelection: [],
      selection: []
    }
  },
  computed: {
    currentPageData() {
      return this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    total() {
      return this.currentData.length
    },
    act() {
      switch (this.tab) {
        case 'add':
          return '添加'
        case 'update':
          return '更新'
        case 'delete':
          return '删除'
        default:
          return '未知'
      }
    }
    // idList() {
    //   return this.currentPageData.filter(i => !i.like).map(i => i.idCode)
    // }
  },
  watch: {
    passed: function(val, oldVal) {
      console.log('passed change')
      this.currentData = [...val]
    }
  },
  created() {
    this.currentData = [...this.passed]
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSubmit() {
      this.$confirm(`将同步${this.act}已选择的信息, 是否确定?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!this.idCodeValidate()) {
            this.$message.error('不能同步身份证号码不合法人员!')
            return false
          }
          this.loading = true
          request('data', 'account_sure', this.multipleSelection, { method: this.tab })
            .then(res => {
              const temp = []
              const idMap = new Map()
              this.multipleSelection.forEach(i => {
                idMap.set(i.userId, 0)
              })
              this.currentData.forEach(i => {
                if (!idMap.has(i.userId)) {
                  temp.push(i)
                }
              })
              this.currentData = temp
              this.multipleSelection.length = 0
              this.$message.success(res.message)
              this.loading = false
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info(`已取消${this.act}`)
        })
    },
    onSubmitAll() {
      this.$confirm(`将同步${this.act}全部信息, 是否确定?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          request('data', 'account_sure', this.currentData, { method: this.tab })
            .then(res => {
              this.currentData = []
              this.multipleSelection = []
              this.$message.success(res.message)
              this.loading = false
            })
            .catch(err => {
              console.log(err.message)
            })
        })
        .catch(() => {
          this.$message.info(`已取消${this.act}`)
        })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
    },
    getOrganName(id) {
      return id ? this.organMap[id]?.shortName : '未定义'
    },
    getDepartmentName(id) {
      return id ? this.departmentMap[id]?.shortName : '未定义'
    },
    onSelectAll(ok) {
      this._selectAll(ok)
    },
    _selectAll(ok) {
      this.idList.forEach(i => {
        this.$set(this.form, i, ok)
      })
    },
    getRowClassName({ row, rowIndex }) {
      if (!row.same || row.same.length === 0) {
        return 'row-expand-cover'
      }
      return 'danger-line'
    },
    idCodeValidate() {
      return this.multipleSelection.every(i => idCodeValidate(i.idCode))
    },
    getIdCodeClassName(id) {
      return idCodeValidate(id) ? '' : 'id-invalid'
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar { margin-bottom: 10px;}
.pagination {
  margin-top: 15px;
}
.inline-span {
  display: inline-block;
  text-align: center;
}
.first-span {
  width: 129px;
}
.second-span {
  width: 100px;
}
.data-list ::v-deep .danger-line{
  background-color: #fde2e2!important;
}
.data-list ::v-deep .row-expand-cover .el-table__expand-icon{
  visibility: hidden!important;
  display: none!important;
}
.id-invalid {
  background-color: #fde2e2!important;
}
.notice code {
  color: #409EFF;
  font-style: italic;
}
</style>
