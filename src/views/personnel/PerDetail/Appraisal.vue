<!--
 * @Author: truxcoder
 * @Date: 2021-11-30 11:23:18
 * @LastEditTime: 2022-01-26 15:26:07
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addVisible = true">添加信息</el-button>
      <el-button v-if="mainData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="考核年份">
          <template slot-scope="scope">{{ scope.row.years }}年</template>
        </el-table-column>
        <el-table-column align="center" label="考核季度">
          <template slot-scope="scope">{{ scope.row.season | seasonFilter }}</template>
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
    <appraisal-add :is-single="true" :single-personnel-data="singlePersonnelData" :visible="addVisible" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <appraisal-update :visible="updateVisible" :is-single="true" :single-personnel-data="singlePersonnelData" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import AppraisalAdd from '@/views/personnel/AppraisalAdd.vue'
import AppraisalUpdate from '@/views/personnel/AppraisalUpdate.vue'

import { mixin } from '@/common/mixin/personnel_detail'

import { conclusionDict, seasonDict } from '@/utils/dict'

export default {
  name: 'Appraisal',
  components: { AppraisalAdd, AppraisalUpdate },
  filters: {
    seasonFilter(season) {
      let result = '未知'
      seasonDict.forEach(item => {
        if (season === item.value) {
          result = item.label
          return
        }
      })
      return result
    }
  },
  mixins: [mixin],
  data() {
    return {
      cpnName: 'Appraisal',
      resource: 'appraisal'
    }
  },
  computed: {
    options() {
      const years = []
      for (let index = 2010; index < 2030; index++) {
        years.push({ label: index + '年', value: index + '' })
      }
      const conclusion = conclusionDict.map(item => {
        return { label: item, value: item }
      })
      // const conclusion = [
      //   { label: '优秀', value: '优秀' },
      //   { label: '称职', value: '称职' },
      //   { label: '基本称职', value: '基本称职' },
      //   { label: '不称职', value: '不称职' },
      //   { label: '不确定等次', value: '不确定等次' }
      // ]
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
  }
}
</script>

<style></style>
