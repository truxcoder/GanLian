<!--
 * @Author: truxcoder
 * @Date: 2022-02-09 09:40:38
 * @LastEditTime: 2022-03-08 15:45:41
 * @LastEditors: truxcoder
 * @Description: 人员个人培训列表
-->
<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="addVisible = true">添加信息</el-button>
      <el-button v-if="currentData.length && can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="currentData.length" class="mt-4">
      <el-table v-loading="loading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.startTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.endTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="培训标题" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="培训学时" align="center">
          <template slot-scope="scope"> {{ scope.row.period }}学时 </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">
              删除
            </el-button>
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <train-person-add :visible="addVisible" :passed="originData" :personnel-id="personnelId" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <training-detail :visible="detailVisible" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
// import DisciplineAdd from '@/views/incorruption/DisciplineAdd.vue'
import TrainPersonAdd from '@/views/personnel/PerDetail/TrainPersonAdd.vue'
import TrainingDetail from '@/views/train/TrainingDetail.vue'

import { permission_mixin } from '@/common/mixin/permission'

import { common_mixin } from '@/common/mixin/mixin'
// import { request } from '@/api'
import { request } from '@/api/index'

export default {
  name: 'Training',
  components: { TrainingDetail, TrainPersonAdd },
  mixins: [permission_mixin, common_mixin],
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
      resource: 'training',
      obj: 'DetailTraining',
      personnelId: this.$route.query.id,
      disDict: [],
      detailVisible: false,
      loading: false,
      addVisible: false,
      originData: [],
      currentData: [],
      multipleSelection: [],
      rowData: {},
      currentEditIndex: 0
    }
  },
  created() {
    this.loading = true
    this.check(this.obj).then(() => {
      this.fetchData()
      this.loading = false
    })
  },
  methods: {
    fetchData() {
      this.queryData = { id: this.$route.query.id }
      request(this.resource, 'detail', this.queryData).then(response => {
        this.originData = response.data ?? []
        this.currentData = response.data ?? []
      })
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    detailClose() {
      this.detailVisible = false
    },
    visibleChange(cpn) {
      const visible = cpn + 'Visible'
      this[visible] = false
    },
    addVisibleChange() {
      this.addVisible = false
    },
    addSuccess() {
      this.addVisible = false
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request('training', 'delete', { personnelId: this.personnelId, trainId: [id] })
            .then(response => {
              this.$message.success(response.message)
              this.fetchData()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    deleteMutiData() {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request('training', 'delete', { personnelId: this.personnelId, trainId: this.multipleSelection.map(item => item.id) })
            .then(response => {
              this.$message.success(response.message)
              this.multipleSelection.length = 0
              this.fetchData()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style></style>
