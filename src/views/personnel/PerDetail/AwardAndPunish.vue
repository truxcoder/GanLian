<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addFormVisible = true">添加信息</el-button>
      <el-button v-if="mainData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="奖励类型" width="150">
          <template slot-scope="scope">
            {{ options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励项/等级">
          <template slot-scope="scope">
            {{ options.grade[scope.row.grade - 1] && options.grade[scope.row.grade - 1].label }}
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
            <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <award-add :is-single="true" :single-personnel-data="singlePersonnelData" :form-visible="addFormVisible" :options="options" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <award-update
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
import AwardAdd from '@/views/award_and_punish/AwardAdd.vue'
import AwardUpdate from '@/views/award_and_punish/AwardUpdate.vue'
import { mixin } from '@/common/mixin/personnel_detail'
import { awardDelete } from '@/api/award'

export default {
  name: 'AwardAndPunish',
  components: { AwardAdd, AwardUpdate },
  mixins: [mixin],
  data() {
    return {
      cpnName: 'AwardAndPunish'
    }
  },
  computed: {
    options() {
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
          awardDelete({ id: [id] })
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
          awardDelete({ id: this.multipleSelection.map(item => item.id) })
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
