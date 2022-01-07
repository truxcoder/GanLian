<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addFormVisible = true">添加信息</el-button>
      <el-button v-if="mainData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="处分类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.category && options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column label="处分项" align="center">
          <template slot-scope="scope">
            {{ scope.row.dictName }}
          </template>
        </el-table-column>
        <el-table-column label="处分时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.getTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="剩余影响期" align="center">
          <template slot-scope="scope">
            {{ scope.row.deadline | deadlineFilter }}
          </template>
        </el-table-column>
        <el-table-column label="处分文号" align="center">
          <template slot-scope="scope">
            {{ scope.row.docNumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
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
    <discipline-add
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :visible="addFormVisible"
      :options="options"
      :dis-dict="disDict"
      @addSuccess="addSuccess"
      @addVisibleChange="addVisibleChange"
    />
    <discipline-update
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :visible="updateFormVisible"
      :options="options"
      :dis-dict="disDict"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @updateVisibleChange="updateVisibleChange"
    />
    <discipline-detail :visible="detailVisible" :is-single="true" :single-personnel-data="singlePersonnelData" :dis-dict="disDict" :options="options" :row="rowData" @detailClose="detailClose" />
  </div>
</template>

<script>
import DisciplineAdd from '@/views/incorruption/DisciplineAdd.vue'
import DisciplineUpdate from '@/views/incorruption/DisciplineUpdate.vue'
import DisciplineDetail from '@/views/incorruption/DisciplineDetail.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { detail_permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import { disciplineDelete, disDictList } from '@/api/discipline'

export default {
  name: 'Discipline',
  components: { DisciplineAdd, DisciplineUpdate, DisciplineDetail },
  mixins: [mixin, detail_permission_mixin, common_mixin],
  data() {
    return {
      cpnName: 'Discipline',
      obj: 'Discipline',
      disDict: [],
      detailVisible: false
    }
  },
  computed: {
    options() {
      const categoryOptions = [
        { label: '党纪处分', value: 1 },
        { label: '政务处分', value: 2 }
      ]
      return {
        organ: this.$store.getters.organs,
        category: categoryOptions
      }
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.fetchDictData()
  },
  methods: {
    fetchDictData() {
      disDictList().then(response => {
        this.disDict = response.data
      })
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          disciplineDelete({ id: [id] })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.mainData = index
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
          disciplineDelete({ id: this.multipleSelection.map(item => item.id) })
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
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    dictChange() {
      this.fetchDictData()
    },
    detailClose() {
      this.detailVisible = false
    }
  }
}
</script>

<style></style>
