<!--
 * @Author: truxcoder
 * @Date: 2022-03-16 20:39:01
 * @LastEditTime: 2022-03-16 21:39:03
 * @LastEditors: truxcoder
 * @Description: 家庭成员页
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
        <el-table-column label="姓名" align="center" prop="name" width="150" />
        <el-table-column label="性别" align="center" prop="gender" width="60" />
        <el-table-column label="关系" align="center" prop="relation" width="90" />
        <el-table-column label="政治面貌" align="center" prop="political" width="150" />
        <el-table-column label="单位" align="center" prop="organ" />
        <el-table-column label="职务" align="center" prop="post" />
        <el-table-column label="是否定居国外" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.isAbroad | ynFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <FamilyEdit
      :visible="editVisible"
      :single-personnel-data="baseData"
      :action="action"
      :row="rowData"
      @editSuccess="editSuccess"
      @visibleChange="visibleChange"
    />
  </div>
</template>

<script>
import FamilyEdit from '@/views/personnel/FamilyEdit.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'

export default {
  name: 'Family',
  components: { FamilyEdit },
  mixins: [mixin, permission_mixin, common_mixin],
  data() {
    return {
      resource: 'family',
      obj: 'DetailFamily'
    }
  },
  computed: {
  },
  created() {
    this.check(this.obj).then(() => {
      this.fetchData()
    })
  },
  methods: {
  }
}
</script>

<style></style>
