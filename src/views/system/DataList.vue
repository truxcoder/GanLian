<!--
 * @Author: truxcoder
 * @Date: 2022-01-19 15:22:52
 * @LastEditTime: 2022-07-27 14:59:33
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
        <p>注意: 同步添加数据时表格内会显示系统内同名人员, 请自判断是否为您将要添加的人员。如果是, 请勿重复添加。</p>
        <p>如果将要添加的人员身份证重复或不合法, 请通知该单位管理员在大数据中心进行修正。</p>
        <p>如果您能判断同名人员确实是将要同步的人员, 而待同步数据中的身份证号码是正确的, 你可以点击同名人员行末的<el-tag size="mini">更新身份证</el-tag>按钮将同名人员的身份证号码进行更正。</p>
      </div>
      <div v-if="tab === 'update'" class="mt-4">
        <span class=" pr-4">如果您有十分的把握，也可略过审查，直接全部更新。请点击:</span>
        <el-button type="danger" plain size="mini" @click="onSubmitAll">全部更新</el-button>
      </div>
    </div>
    <el-table :data="currentPageData" element-loading-text="Loading" border :row-class-name="getRowClassName" :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template #default="props">
          <div v-if="props.row.same">
            <div v-for="v in props.row.same" :key="v.id" class="h-10 flex items-center text-blue-500">
              <span class="inline-span" style="width:103px"><el-tag size="mini" type="primary">同名人员</el-tag></span>
              <span class="inline-span" style="width:100px">{{ v.name }}</span>
              <span class="inline-span" style="width:180px">{{ v.idCode }}</span>
              <span class="inline-span" style="width:150px">{{ v.birthday | dateFilter }}</span>
              <span class="inline-span" style="width:120px">{{ getOrganName(v.organID) }}</span>
              <span class="inline-span" style="width:150px">{{ getDepartmentName(v.departmentId) }}</span>
              <span class="inline-span" style="width:100px">{{ v.userType | userTypeFilter }}</span>
              <span class="inline-span" style="width:150px">{{ v.phone }}</span>
              <span class="inline-span flex-1">
                <el-button type="primary" size="mini" plain @click="onUpdateIdCode(v,props.row.idCode)">更新身份证</el-button>
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" width="80">
        <template #header>
          <el-checkbox v-model="all" @change="onSelectAll" />
        </template>
        <template #default="scope">
          <div v-if="scope.row.like"><el-tag size="mini" type="primary">同名</el-tag></div>
          <el-checkbox v-else v-model="form[scope.row.idCode]" />
        </template>
      </el-table-column> -->
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号" width="180">
        <template slot-scope="scope">
          <div :class="getIdCodeClassName(scope.row.idCode)"> {{ scope.row.idCode }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出生日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.birthday | dateFilter }}
        </template>
      </el-table-column>
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
      <el-table-column align="center" label="电话" width="150">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.same ? '有同名人员' : '' }}
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
import { idCodeValidate } from '@/utils/validate'
import isEmpty from 'lodash/isEmpty'

export default {
  name: 'DataList',
  filters: {
    userTypeFilter(userType) {
      if (userType === 1) {
        return '民警'
      }
      if (userType === 2) {
        return '辅警'
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
          if (isEmpty(this.multipleSelection)) {
            this.$message.info('您未选择任何数据')
            return false
          }
          this.loading = true
          request('data', 'sure', this.multipleSelection, { method: this.tab })
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
          request('data', 'sure', this.currentData, { method: this.tab })
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
    onUpdateIdCode(old, newId) {
      this.$confirm(`将把${old.name}的身份证号码从 ${old.idCode} 更改为 ${newId} , 是否确定?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          // curd('update', { id: old.id, idCode: newId }, { resource: 'personnel' })
          request('personnel', 'update_id_code', { id: old.id, idCode: newId })
            .then(res => {
              const ids = this.multipleSelection.map(i => i.userId)
              const temp = []
              let _index = -1
              this.currentData.some((i, index) => {
                if (i.idCode === newId) {
                  _index = index
                  return true
                }
              })
              if (_index !== -1) {
                this.currentData.splice(_index, 1)
              }
              this.currentData.forEach(i => {
                if (!ids.includes(i.userId)) {
                  temp.push(i)
                }
              })
              this.currentData = temp
              this.multipleSelection.length = 0
              this.$message.success(res.message)
              this.loading = false
            })
            .catch(err => {
              console.log(err.message)
            })
        })
        .catch(() => {
          this.$message.info(`已取消更改身份证号码`)
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
