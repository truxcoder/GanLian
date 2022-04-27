<!--
 * @Author: truxcoder
 * @Date: 2021-11-30 15:39:29
 * @LastEditTime: 2022-04-11 10:54:29
 * @LastEditors: truxcoder
 * @Description: 人员详情页任职列表
-->
<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="handleEdit('add')">添加信息</el-button>
      <el-button v-if="currentData.length && can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="currentData.length" class="mt-4">
      <el-table v-loading="loading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="任职单位" prop="organ" />
        <el-table-column align="center" label="任职部门" prop="department" />
        <el-table-column align="center" label="担任职务" width="150" prop="positionName" />
        <el-table-column align="center" label="级别" width="100" prop="levelName" />
        <el-table-column align="center" label="任职开始时间" width="150">
          <template slot-scope="scope">{{ scope.row.startDay | dateFilter }}</template>
        </el-table-column>
        <el-table-column align="center" label="任职结束时间" width="150">
          <template slot-scope="scope">{{ scope.row.endDay | dateEndFilter }}</template>
        </el-table-column>
        <el-table-column v-if="canOperate" align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <PostEdit :visible="editVisible" :is-single="true" :single-personnel-data="baseData" :action="action" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import PostEdit from '@/views/personnel/PostEdit.vue'
import { mixin } from '@/common/mixin/personnel_detail'
import { common_mixin } from '@/common/mixin/mixin'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'Post',
  components: { PostEdit },
  mixins: [common_mixin, mixin, permission_mixin],
  data() {
    return {
      resource: 'post',
      obj: 'DetailPost'
    }
  },
  created() {
    this.check(this.obj).then(() => {
      this.fetchData()
    })
  }
}
</script>

<style></style>
