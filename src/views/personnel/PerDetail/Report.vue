<!--
 * @Author: truxcoder
 * @Date: 2021-11-30 15:39:29
 * @LastEditTime: 2022-02-21 10:58:09
 * @LastEditors: truxcoder
 * @Description: 人员详情页举报列表
-->
<template>
  <div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="涉及人员">
          <template slot-scope="scope">
            {{ scope.row.personnels | personList }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前阶段" width="160">
          <template slot-scope="scope">
            {{ scope.row.step | stepFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <report-detail :visible="detailVisible" :options="options" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import ReportDetail from '@/views/incorruption/ReportDetail.vue'

import { mixin } from '@/common/mixin/personnel_detail'

export default {
  name: 'Post',
  components: { ReportDetail },
  filters: {
    personList(arr) {
      if (!arr) {
        return '无'
      }
      return arr.map(item => item.name).join(', ')
    },
    stepFilter(step) {
      let result
      switch (step) {
        case 1:
          result = '谈话函询阶段'
          break
        case 2:
          result = '初步核查阶段'
          break
        case 3:
          result = '立案查询调查阶段'
          break
        case 100:
          result = '调查完结(属实)'
          break
        case 99:
          result = '调查完结(不属实)'
          break

        default:
          result = '未定义'
          break
      }
      return result
    }
  },
  mixins: [mixin],
  data() {
    return {
      cpnName: 'Report',
      resource: 'report'
    }
  },
  computed: {
    options() {
      const step = [
        { label: '谈话函询阶段', value: 1 },
        { label: '初步核查阶段', value: 2 },
        { label: '立案审查调查阶段', value: 3 },
        { label: '调查完结结果属实', value: 100 },
        { label: '调查完结结果不属实', value: 99 }
      ]
      return {
        step
      }
    }
  },
  methods: {
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    }
  }
}
</script>

<style></style>
