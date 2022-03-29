<!--
 * @Author: truxcoder
 * @Date: 2022-03-16 15:27:45
 * @LastEditTime: 2022-03-16 17:28:36
 * @LastEditors: truxcoder
 * @Description:
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
        <el-table-column label="分类" align="center" width="220">
          <template slot-scope="scope">
            {{ getCategory(scope.row.category) }}
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <AffairEdit
      :visible="editVisible"
      :is-single="true"
      :single-personnel-data="baseData"
      :action="action"
      :row="rowData"
      @editSuccess="editSuccess"
      @visibleChange="visibleChange"
    />

    <AffairDetail :visible="detailVisible" :row="rowData" :person-name="baseData.name" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import AffairEdit from '@/views/incorruption/AffairEdit.vue'
import AffairDetail from '@/views/incorruption/AffairDetail.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import { affairCategoryDict } from '@/utils/dict'

export default {
  name: 'Affair',
  components: { AffairEdit, AffairDetail },
  mixins: [mixin, permission_mixin, common_mixin],
  data() {
    return {
      resource: 'affair',
      obj: 'DetailAffair'
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
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    detailClose() {
      this.detailVisible = false
    },
    getCategory(c) {
      return c ? affairCategoryDict[c] : '未定义'
    }
  }
}
</script>

<style></style>
