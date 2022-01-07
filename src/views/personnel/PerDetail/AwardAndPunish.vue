<template>
  <div>
    <!-- 奖励部分开始 -->
    <div class=" mr-4  font-semibold text-gray-500">组织奖励</div>
    <hr class="mb-2" />
    <div class=" flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="awardAddVisible = true">添加信息</el-button>
      <el-button v-if="can.delete && awardData.length" type="danger" :disabled="!awardMultipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData('Award')">删除</el-button>
    </div>
    <div v-if="awardData.length" class="mt-4">
      <el-table v-loading="loading" :data="awardData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleAwardSelectionChange">
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
      <el-button v-if="can.add" type="primary" size="mini" @click="punishAddVisible = true">添加信息</el-button>
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
    <award-add :is-single="true" :single-personnel-data="singlePersonnelData" :form-visible="awardAddVisible" :options="awardOptions" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <award-update
      :form-visible="awardUpdateVisible"
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :options="awardOptions"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @updateVisibleChange="updateVisibleChange"
    />
    <punish-add
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :form-visible="punishAddVisible"
      :options="punishOptions"
      @addSuccess="addSuccess"
      @addVisibleChange="addVisibleChange"
    />
    <punish-update
      :form-visible="punishUpdateVisible"
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :options="punishOptions"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @updateVisibleChange="updateVisibleChange"
    />
  </div>
</template>

<script>
import AwardAdd from '@/views/award_and_punish/AwardAdd.vue'
import AwardUpdate from '@/views/award_and_punish/AwardUpdate.vue'
import PunishAdd from '@/views/award_and_punish/PunishAdd.vue'
import PunishUpdate from '@/views/award_and_punish/PunishUpdate.vue'
import { detail_permission_mixin } from '@/common/mixin/permission'
import { awardDelete } from '@/api/award'
import { punishDelete } from '@/api/punish'

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
      currentEditIndex: 0
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
    },
    punishOptions() {
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
    }
  },
  methods: {
    handleDelete(index, id, module) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let deleteFunc
          if (module === 'Award') {
            deleteFunc = awardDelete
          } else if (module === 'Punish') {
            deleteFunc = punishDelete
          }

          deleteFunc({ id: [id] })
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
          let deleteFunc, data
          if (module === 'Award') {
            deleteFunc = awardDelete
            data = { id: this.awardMultipleSelection.map(item => item.id) }
          } else if (module === 'Punish') {
            deleteFunc = punishDelete
            data = { id: this.punishMultipleSelection.map(item => item.id) }
          }
          deleteFunc(data)
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
    addVisibleChange(module) {
      if (module === 'Award') {
        this.awardAddVisible = false
      } else if (module === 'Punish') {
        this.punishAddVisible = false
      }
    },
    updateVisibleChange(module) {
      if (module === 'Award') {
        this.awardUpdateVisible = false
      } else if (module === 'Punish') {
        this.punishUpdateVisible = false
      }
    },
    addSuccess(module) {
      if (module === 'Award') {
        this.awardAddVisible = false
      } else if (module === 'Punish') {
        this.punishAddVisible = false
      }
      this.$emit('reFetchCpnData', module)
    },
    updateSuccess(module) {
      if (module === 'Award') {
        this.awardUpdateVisible = false
      } else if (module === 'Punish') {
        this.punishUpdateVisible = false
      }
      this.$emit('reFetchCpnData', module)
    },
    handleAwardSelectionChange(val) {
      this.awardMultipleSelection = val
    },
    handlePunishSelectionChange(val) {
      this.punishMultipleSelection = val
    },
    handleUpdate(index, row, module) {
      this.rowData = row
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
