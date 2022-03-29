<!--
 * @Author: truxcoder
 * @Date: 2022-01-19 15:22:52
 * @LastEditTime: 2022-03-15 11:23:46
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
      <div v-if="tab === 'update'" class="mt-4">
        <span class=" pr-4">如果您有十分的把握，也可略过审查，直接全部更新。请点击:</span>
        <el-button type="danger" plain size="mini" @click="onSubmitAll">全部更新</el-button>
      </div>
    </div>
    <el-table :data="currentPageData" element-loading-text="Loading" border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="简称">
        <template slot-scope="scope">
          {{ scope.row.shortName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属单位">
        <template slot-scope="scope">
          {{ getOrganName(scope.row.busOrgCode) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="父部门">
        <template slot-scope="scope">
          {{ getDepartmentName(scope.row.parentId) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.deptType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.dataStatus }}
        </template>
      </el-table-column>
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

export default {
  name: 'DepartmentList',
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
          this.loading = true
          let data = this.multipleSelection
          if (this.tab === 'delete') {
            data = { id: this.multipleSelection.map(i => i.deptId) }
          }
          request('data', 'department_sure', data, { method: this.tab })
            .then(res => {
              const ids = this.multipleSelection.map(i => i.deptId)
              const temp = []
              this.currentData.forEach(i => {
                if (!ids.includes(i.deptId)) {
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
          request('data', 'department_sure', this.currentData, { method: this.tab })
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
    getDepartmentName(id) {
      if (!(id in this.departmentMap)) {
        return '未找到'
      }
      return this.departmentMap[id].name
    },
    getOrganName(code) {
      const organ = this.$store.getters.organs.find(item => item.busOrgCode === code)
      return organ ? organ.shortName : '未找到'
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
</style>
