<template>
  <div>
    <!-- 奖励部分开始 -->
    <div class=" mr-4  font-semibold text-gray-500">组织奖励</div>
    <hr class="mb-2" />
    <div class=" flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="handleEdit('award', 'add')">添加信息</el-button>
      <el-button v-if="currentAwardData.length && can.delete" :disabled="!awardMultipleSelection.length" type="danger" icon="el-icon-delete" size="mini" @click="deleteMutiData('award')">删除</el-button>
    </div>
    <div v-if="currentAwardData.length" class="mt-4">
      <el-table
        v-loading="loading"
        :data="currentAwardData"
        element-loading-text="Loading"
        stripe
        border
        :fit="true"
        highlight-current-row
        @selection-change="handleAwardSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="奖励类型" width="150">
          <template slot-scope="scope">
            {{ awardOptions.category[scope.row.category - 1] && awardOptions.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励项/等级">
          <template slot-scope="scope">
            {{ awardMap.get(scope.row.grade) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励时间">
          <template slot-scope="scope">{{ scope.row.getTime | dateFilter }}</template>
        </el-table-column>
        <el-table-column align="center" label="奖励文号">
          <template slot-scope="scope">{{ scope.row.docNumber }}</template>
        </el-table-column>
        <el-table-column v-if="canOperate" align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('award', 'update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.row.id, 'award')">删除</el-button>
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
      <el-button v-if="can.add" type="primary" size="mini" @click="handleEdit('punish', 'add')">添加信息</el-button>
      <el-button v-if="currentPunishData.length && can.delete" :disabled="!punishMultipleSelection.length" type="danger" icon="el-icon-delete" size="mini" @click="deleteMutiData('punish')">删除</el-button>
    </div>
    <div v-if="currentPunishData.length" class="mt-4">
      <el-table
        v-loading="loading"
        :data="currentPunishData"
        element-loading-text="Loading"
        stripe
        border
        :fit="true"
        highlight-current-row
        @selection-change="handlePunishSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="处理类型" width="150">
          <template slot-scope="scope">
            {{ punishOptions.category[scope.row.category - 1] && punishOptions.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理项">
          <template slot-scope="scope">
            {{ punishMap.get(scope.row.grade) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理时间">
          <template slot-scope="scope">{{ scope.row.getTime | dateFilter }}</template>
        </el-table-column>
        <el-table-column align="center" label="处理文号">
          <template slot-scope="scope">{{ scope.row.docNumber }}</template>
        </el-table-column>
        <el-table-column v-if="canOperate" align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('punish', 'update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.row.id, 'punish')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <!-- 处理部分结束 -->
    <AwardEdit
      :is-single="true"
      :visible="awardVisible"
      :single-personnel-data="baseData"
      :action="action"
      :row="rowData"
      :options="awardOptions"
      @editSuccess="editSuccess"
      @visibleChange="visibleChange"
    />
    <PunishEdit
      :is-single="true"
      :visible="punishVisible"
      :single-personnel-data="baseData"
      :action="action"
      :row="rowData"
      :options="punishOptions"
      @editSuccess="editSuccess"
      @visibleChange="visibleChange"
    />
  </div>
</template>

<script>
import { awardCategory, awardGrade, punishCategory, punishGrade } from '@/utils/dict'
import PunishEdit from '@/views/award_and_punish/PunishEdit.vue'
import AwardEdit from '@/views/award_and_punish/AwardEdit.vue'
import { permission_mixin } from '@/common/mixin/permission'

import { request, curd } from '@/api/index'

import dayjs from 'dayjs'

export default {
  name: 'AwardAndPunish',
  components: { AwardEdit, PunishEdit },
  filters: {
    dateFilter(date) {
      if (dayjs(date).year() === 2100) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    }
  },
  mixins: [permission_mixin],
  props: {
    baseData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      obj: 'DetailAwardPunish',
      originAwardData: [],
      originPunishData: [],
      currentAwardData: [],
      currentPunishData: [],
      awardVisible: false,
      awardMultipleSelection: [],
      punishVisible: false,
      punishMultipleSelection: [],
      rowData: {},
      action: '',
      currentEditIndex: 0,
      loading: false,
      currentOperateCpn: ''
    }
  },
  computed: {
    canOperate() {
      return this.can.update || this.can.delete
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
    awardMap() {
      const _map = new Map()
      awardGrade.forEach(item => {
        _map.set(item.value, item.label)
      })
      return _map
    },
    punishMap() {
      const _map = new Map()
      punishGrade.forEach(item => {
        _map.set(item.value, item.label)
      })
      return _map
    }
  },
  created() {
    this.check(this.obj).then(() => {
      this.fetchAllData()
    })
  },
  methods: {
    fetchAllData(data = {}) {
      this.loading = true
      this.queryData = { id: this.$route.query.id }
      const promises = [request('award', 'detail', this.queryData), request('punish', 'detail', this.queryData)]
      Promise.all(promises).then(responses => {
        this.originAwardData = responses[0].data ?? []
        this.originPunishData = responses[1].data ?? []
        this.currentAwardData = responses[0].data ?? []
        this.currentPunishData = responses[1].data ?? []
        this.loading = false
      })
    },
    fetchData(resource) {
      this.queryData = { id: this.$route.query.id }
      request(resource, 'detail', this.queryData).then(response => {
        if (resource === 'award') {
          this.originAwardData = response.data ?? []
          this.currentAwardData = response.data ?? []
        } else if (resource === 'punish') {
          this.originPunishData = response.data ?? []
          this.currentPunishData = response.data ?? []
        }
      })
    },
    handleDelete(id, module) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          curd('delete', { id: [id] }, { resource: module })
            .then(response => {
              this.$message.success(response.message)
              this.fetchData(module)
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
          if (module === 'award') {
            data = { id: this.awardMultipleSelection.map(item => item.id) }
          } else if (module === 'punish') {
            data = { id: this.punishMultipleSelection.map(item => item.id) }
          }
          curd('delete', data, { resource: module })
            .then(response => {
              this.$message.success(response.message)
              this.fetchData(module)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    visibleChange() {
      const visible = this.currentOperateCpn + 'Visible'
      this[visible] = false
      this.currentOperateCpn = ''
    },
    editSuccess() {
      const cpn = this.currentOperateCpn + ''
      const visible = this.currentOperateCpn + 'Visible'
      this[visible] = false
      this.currentOperateCpn = ''
      this.fetchData(cpn)
    },
    handleAwardSelectionChange(val) {
      this.awardMultipleSelection = val
    },
    handlePunishSelectionChange(val) {
      this.punishMultipleSelection = val
    },
    handleEdit(resource, act, row) {
      this.currentOperateCpn = resource
      this.action = act
      if (act === 'add') {
        this.rowData = {}
      } else {
        this.rowData = row
      }
      if (resource === 'award') {
        this.awardVisible = true
      } else if (resource === 'punish') {
        this.punishVisible = true
      }
    }
  }
}
</script>

<style></style>
