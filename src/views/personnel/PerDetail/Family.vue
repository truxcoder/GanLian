<!--
 * @Author: truxcoder
 * @Date: 2022-03-16 20:39:01
 * @LastEditTime: 2024-04-06 21:39:22
 * @LastEditors: truxcoder
 * @Description: 家庭成员页
-->
<template>
  <div>
    <div class="flex items-center text-left">
      <el-button v-if="can.add" type="primary" size="mini" @click="handleEdit('add')">添加信息</el-button>
      <el-button v-if="currentData.length && can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="currentData.length" class="mt-4">
      <el-table v-loading="loading" :data="sortedData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="姓名" align="center" prop="name" width="150" />
        <el-table-column label="性别" align="center" prop="gender" width="60" />
        <el-table-column label="称谓" align="center" prop="relation" width="90" />
        <el-table-column label="出生日期" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.birthday | dateMonthFilter }}
          </template>
        </el-table-column>
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
    <div v-else class="mt-4 pl-1 text-gray-600">暂无数据</div>
    <FamilyEdit :visible="editVisible" :single-personnel-data="baseData" :action="action" :row="rowData" :can="can" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import FamilyEdit from '@/views/personnel/FamilyEdit.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { PerDetailDeleteMixin } from '@/common/mixin/delete'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import { relationDict } from '@/utils/dict'

export default {
  name: 'Family',
  components: { FamilyEdit },
  mixins: [mixin, permission_mixin, common_mixin, PerDetailDeleteMixin],
  data() {
    return {
      resource: 'family',
      obj: 'DetailFamily',
    }
  },
  computed: {
    relationMap() {
      const _map = new Map()
      relationDict.forEach((i) => {
        _map.set(i.value, i.sort)
      })
      return _map
    },
    sortedData() {
      const temp = [...this.currentData]
      const _map = new Map()
      relationDict.forEach((i) => {
        _map.set(i.value, i.sort)
      })
      return temp.sort((a, b) => {
        if (!_map.get(a.relation)) {
          return 1
        } else if (!_map.get(b.relation)) {
          return -1
        } else {
          return _map.get(a.relation) - _map.get(b.relation)
        }
      })
    },
  },
  created() {
    this.check(this.obj).then(() => {
      // 成戒所：单独给普通用户赋权，用于修改个人家庭成员信息。
      if (this.$store.getters.organ === '3d7e73e3a3034ca1a1da707aa3d54a96' && this.$store.state.settings?.setting?.cjs) {
        this.permission.ADD = true
        this.permission.UPDATE = true
      }
      this.fetchData()
    })
  },
  methods: {},
}
</script>

<style></style>
