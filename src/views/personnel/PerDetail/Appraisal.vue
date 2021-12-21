<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addFormVisible = true">添加信息</el-button>
      <el-button v-if="mainData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="考核时间">
          <template slot-scope="scope">{{ scope.row.years }}年</template>
        </el-table-column>
        <el-table-column align="center" label="考核结果">
          <template slot-scope="scope">{{ scope.row.conclusion }}</template>
        </el-table-column>
        <el-table-column align="center" label="考核单位">
          <template slot-scope="scope">{{ scope.row.organName }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <appraisal-add :is-single="true" :single-personnel-data="singlePersonnelData" :options="options" :form-visible="addFormVisible" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <appraisal-update
      :form-visible="updateFormVisible"
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :options="options"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @updateVisibleChange="updateVisibleChange"
    />
  </div>
</template>

<script>
import AppraisalAdd from '@/views/personnel/AppraisalAdd.vue'
import AppraisalUpdate from '@/views/personnel/AppraisalUpdate.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { appraisalDelete } from '@/api/appraisal'

export default {
  name: 'Appraisal',
  components: { AppraisalAdd, AppraisalUpdate },
  mixins: [mixin],
  data() {
    return {
      cpnName: 'Appraisal'
    }
  },
  computed: {
    options() {
      const years = []
      for (let index = 2010; index < 2030; index++) {
        years.push({ label: index + '年', value: index + '' })
      }
      const conclusion = [
        { label: '优秀', value: '优秀' },
        { label: '称职', value: '称职' },
        { label: '基本称职', value: '基本称职' },
        { label: '不称职', value: '不称职' },
        { label: '不评定等次', value: '不评定等次' }
      ]
      return {
        organ: this.$store.getters.organs,
        years,
        conclusion
      }
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
  },
  methods: {
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          appraisalDelete({ id: [id] })
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
          appraisalDelete({ id: this.multipleSelection.map(item => item.id) })
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
