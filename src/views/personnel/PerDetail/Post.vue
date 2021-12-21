<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addFormVisible = true">添加信息</el-button>
      <el-button v-if="mainData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="担任职务" width="150">
          <template slot-scope="scope">{{ scope.row.positionName }}</template>
        </el-table-column>
        <el-table-column align="center" label="任职部门">
          <template slot-scope="scope">{{ scope.row.departmentName }}</template>
        </el-table-column>
        <el-table-column align="center" label="任职单位">
          <template slot-scope="scope">{{ scope.row.organName }}</template>
        </el-table-column>
        <el-table-column align="center" label="级别" width="100">
          <template slot-scope="scope">{{ scope.row.levelName }}</template>
        </el-table-column>
        <el-table-column align="center" label="任职开始时间" width="150">
          <template slot-scope="scope">{{ scope.row.startDay | dateFilter }}</template>
        </el-table-column>
        <el-table-column align="center" label="任职结束时间" width="150">
          <template slot-scope="scope">{{ scope.row.endDay | dateFilter }}</template>
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
    <post-add :is-single="true" :single-personnel-data="singlePersonnelData" :form-visible="addFormVisible" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <post-update
      :form-visible="updateFormVisible"
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @updateVisibleChange="updateVisibleChange"
    />
  </div>
</template>

<script>
import PostAdd from '@/views/personnel/PostAdd.vue'
import PostUpdate from '@/views/personnel/PostUpdate.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { postDelete } from '@/api/post'

export default {
  name: 'Post',
  components: { PostAdd, PostUpdate },
  mixins: [mixin],
  data() {
    return {
      cpnName: 'Post'
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
          postDelete({ id: [id] })
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
          postDelete({ id: this.multipleSelection.map(item => item.id) })
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
