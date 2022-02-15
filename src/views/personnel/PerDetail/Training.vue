<!--
 * @Author: truxcoder
 * @Date: 2022-02-09 09:40:38
 * @LastEditTime: 2022-02-09 19:20:51
 * @LastEditors: truxcoder
 * @Description: 人员个人培训列表
-->
<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addVisible = true">添加信息</el-button>
      <el-button v-if="passedData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="passedData.length" class="mt-4">
      <el-table v-loading="cpnLoading" :data="passedData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
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
    <train-person-add :visible="addVisible" :passed="passedData" :personnel-id="personnelId" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <training-detail :visible="detailVisible" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
// import DisciplineAdd from '@/views/incorruption/DisciplineAdd.vue'
import TrainPersonAdd from '@/views/personnel/PerDetail/TrainPersonAdd.vue'
import TrainingDetail from '@/views/train/TrainingDetail.vue'

import { detail_permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
// import { request } from '@/api'
import { request } from '@/api/index'

export default {
  name: 'Training',
  components: { TrainingDetail, TrainPersonAdd },
  mixins: [detail_permission_mixin, common_mixin],
  props: {
    passedData: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    personnelId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      cpnName: 'Training',
      resource: 'training',
      obj: 'Training',
      disDict: [],
      detailVisible: false,
      tabLoading: false,
      addVisible: false,
      multipleSelection: [],
      rowData: {},
      currentEditIndex: 0
    }
  },
  computed: {
    cpnLoading() {
      return this.loading || this.tabLoading
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.tabLoading = true
    this.check().then(() => {
      this.tabLoading = false
    })
  },
  methods: {
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
      this.$emit('reFetchCpnData', this.cpnName)
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
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$emit('reFetchCpnData', this.cpnName)
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
    deleteMutiData() {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request('training', 'delete', { personnelId: this.personnelId, trainId: this.multipleSelection.map(item => item.id) })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$emit('reFetchCpnData', this.cpnName)
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
    }
  }
}
</script>

<style></style>
