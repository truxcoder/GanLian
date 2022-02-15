<template>
  <div>
    <!-- 奖励部分开始 -->
    <div class=" mr-4  font-semibold text-gray-500">组织奖励</div>
    <hr class="mb-2" />
    <div class=" flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="handleAdd('Award')">添加信息</el-button>
      <el-button v-if="can.delete && awardData.length" type="danger" :disabled="!awardMultipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData('Award')">删除</el-button>
    </div>
    <div v-if="awardData.length" class="mt-4">
      <el-table v-loading="cpnLoading" :data="awardData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleAwardSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="奖励类型" width="150">
          <template slot-scope="scope">
            {{ awardOptions.category[scope.row.category - 1] && awardOptions.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励项/等级">
          <template slot-scope="scope">
            {{ awardOptions.grade[scope.row.grade - 1] && awardOptions.grade[scope.row.grade - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励时间">
          <template slot-scope="scope">{{ scope.row.getTime | dateFilter }}</template>
        </el-table-column>
        <el-table-column align="center" label="奖励文号">
          <template slot-scope="scope">{{ scope.row.docNumber }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row, 'Award')">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id, 'Award')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <!-- 奖励部分结束 -->
    <!-- 处理部分开始 -->
    <div class=" mr-4 mt-4 font-semibold text-gray-500">组织处理</div>
    <hr class="mb-2" />
    <div class=" flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="handleAdd('Punish')">添加信息</el-button>
      <el-button v-if="can.delete && punishData.length" type="danger" :disabled="!punishMultipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData('Punish')">删除</el-button>
    </div>
    <div v-if="punishData.length" class="mt-4">
      <el-table v-loading="loading" :data="punishData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handlePunishSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="处理类型" width="150">
          <template slot-scope="scope">
            {{ punishOptions.category[scope.row.category - 1] && punishOptions.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理项">
          <template slot-scope="scope">
            {{ punishOptions.grade[scope.row.grade - 1] && punishOptions.grade[scope.row.grade - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理时间">
          <template slot-scope="scope">{{ scope.row.getTime | dateFilter }}</template>
        </el-table-column>
        <el-table-column align="center" label="处理文号">
          <template slot-scope="scope">{{ scope.row.docNumber }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row, 'Punish')">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id, 'Punish')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <!-- 处理部分结束 -->
    <award-add :is-single="true" :single-personnel-data="singlePersonnelData" :visible="awardAddVisible" :options="awardOptions" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <award-update
      :visible="awardUpdateVisible"
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :options="awardOptions"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @visibleChange="visibleChange"
    />
    <punish-add :is-single="true" :single-personnel-data="singlePersonnelData" :visible="punishAddVisible" :options="punishOptions" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <punish-update
      :visible="punishUpdateVisible"
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :options="punishOptions"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @visibleChange="visibleChange"
    />
  </div>
</template>

<script>
import { awardCategory, awardGrade, punishCategory, punishGrade } from '@/utils/dict'
import AwardAdd from '@/views/award_and_punish/AwardAdd.vue'
import AwardUpdate from '@/views/award_and_punish/AwardUpdate.vue'
import PunishAdd from '@/views/award_and_punish/PunishAdd.vue'
import PunishUpdate from '@/views/award_and_punish/PunishUpdate.vue'
import { detail_permission_mixin } from '@/common/mixin/permission'
import { curd } from '@/api/index'

import dayjs from 'dayjs'

export default {
  name: 'AwardAndPunish',
  components: { AwardAdd, AwardUpdate, PunishAdd, PunishUpdate },
  filters: {
    dateFilter(date) {
      if (dayjs(date).year() === 2100) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    }
  },
  mixins: [detail_permission_mixin],
  props: {
    awardPassedData: {
      type: Array,
      default() {
        return []
      }
    },
    punishPassedData: {
      type: Array,
      default() {
        return []
      }
    },
    singlePersonnelData: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      cpnName: 'AwardAndPunish',
      obj: 'Award',
      dialogLoading: false,
      awardUpdateVisible: false,
      awardAddVisible: false,
      awardMultipleSelection: [],
      punishUpdateVisible: false,
      punishAddVisible: false,
      punishMultipleSelection: [],
      rowData: {},
      currentEditIndex: 0,
      tabLoading: false,
      currentOperateCpn: ''
    }
  },
  computed: {
    awardData: {
      get: function() {
        return this.awardPassedData
      },
      set: function(index) {
        this.awardData.splice(index, 1)
      }
    },
    punishData: {
      get: function() {
        return this.punishPassedData
      },
      set: function(index) {
        this.punishData.splice(index, 1)
      }
    },
    awardOptions() {
      const categoryOptions = awardCategory
      const gradeOptions = awardGrade
      return {
        category: categoryOptions,
        grade: gradeOptions
      }
    },
    punishOptions() {
      const categoryOptions = punishCategory
      const gradeOptions = punishGrade
      return {
        category: categoryOptions,
        grade: gradeOptions
      }
    },
    cpnLoading() {
      return this.loading || this.tabLoading
    }
  },
  created() {
    this.tabLoading = true
    this.check().then(() => {
      this.tabLoading = false
    })
  },
  methods: {
    handleDelete(index, id, module) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          curd('delete', { id: [id] }, { resource: module.toLowerCase() })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              if (module === 'Award') {
                this.awardData = index
              } else if (module === 'Punish') {
                this.punishData = index
              }
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
    deleteMutiData(module) {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data
          if (module === 'Award') {
            data = { id: this.awardMultipleSelection.map(item => item.id) }
          } else if (module === 'Punish') {
            data = { id: this.punishMultipleSelection.map(item => item.id) }
          }
          curd('delete', data, { resource: module.toLowerCase() })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$emit('reFetchCpnData', module)
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
    visibleChange(cpn) {
      cpn = cpn.trim().replace(cpn[0], cpn[0].toUpperCase())
      const module = this.currentOperateCpn.trim().replace(this.currentOperateCpn[0], this.currentOperateCpn[0].toLowerCase())
      const visible = module + cpn + 'Visible'
      console.log('visible:', visible)
      this[visible] = false
      this.currentOperateCpn = ''
    },
    addSuccess() {
      const cpn = this.currentOperateCpn + ''
      this.visibleChange('add')
      this.$emit('reFetchCpnData', cpn)
    },
    updateSuccess() {
      const cpn = this.currentOperateCpn + ''
      this.visibleChange('update')
      this.$emit('reFetchCpnData', cpn)
    },
    handleAwardSelectionChange(val) {
      this.awardMultipleSelection = val
    },
    handlePunishSelectionChange(val) {
      this.punishMultipleSelection = val
    },
    handleAdd(module) {
      this.currentOperateCpn = module
      if (module === 'Award') {
        this.awardAddVisible = true
      } else if (module === 'Punish') {
        this.punishAddVisible = true
      }
    },
    handleUpdate(index, row, module) {
      this.rowData = row
      this.currentOperateCpn = module
      this.currentEditIndex = index
      if (module === 'Award') {
        this.awardUpdateVisible = true
      } else if (module === 'Punish') {
        this.punishUpdateVisible = true
      }
    }
  }
}
</script>

<style></style>
