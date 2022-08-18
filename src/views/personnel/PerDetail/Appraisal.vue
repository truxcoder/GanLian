<!--
 * @Author: truxcoder
 * @Date: 2021-11-30 11:23:18
 * @LastEditTime: 2022-08-03 15:39:17
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
      <el-table v-loading="loading" :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="考核年份">
          <template slot-scope="scope">{{ scope.row.years }}年</template>
        </el-table-column>
        <el-table-column align="center" label="考核季度">
          <template slot-scope="scope">{{ itemMap.get(scope.row.season) }}</template>
        </el-table-column>
        <el-table-column align="center" label="考核结果">
          <template slot-scope="scope">{{ scope.row.conclusion }}</template>
        </el-table-column>
        <el-table-column align="center" label="考核单位">
          <template slot-scope="scope">{{ scope.row.organ }}</template>
        </el-table-column>
        <el-table-column v-if="canOperate" align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="currentData.length"
        class="pagination"
        background
        hide-on-single-page
        :current-page="currentPage"
        :page-sizes="[10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <AppraisalEdit
      :visible="editVisible"
      :action="action"
      :is-single="true"
      :single-personnel-data="baseData"
      :row="rowData"
      :options="options"
      @editSuccess="editSuccess"
      @visibleChange="visibleChange"
    />
  </div>
</template>

<script>
import AppraisalEdit from '@/views/personnel/AppraisalEdit.vue'
import { permission_mixin } from '@/common/mixin/permission'
import { mixin } from '@/common/mixin/personnel_detail'
import { PerDetailDeleteMixin } from '@/common/mixin/delete'

import { conclusionDict, seasonDict } from '@/utils/dict'

export default {
  name: 'Appraisal',
  components: { AppraisalEdit },
  mixins: [mixin, permission_mixin, PerDetailDeleteMixin],
  data() {
    return {
      obj: 'DetailAppraisal',
      resource: 'appraisal',
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    options() {
      const years = []
      for (let index = 2010; index < 2030; index++) {
        years.push({ label: index + '年', value: index + '' })
      }
      const conclusion = conclusionDict
      return {
        organ: this.$store.getters.organs,
        years,
        conclusion,
        season: seasonDict
      }
    },
    itemMap() {
      const _map = new Map()
      seasonDict.forEach(item => {
        _map.set(item.value, item.label)
      })
      return _map
    },
    total() {
      return this.currentData.length
    },
    currentPageData() {
      return this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  created() {
    this.check(this.obj).then(() => {
      this.fetchData()
    })
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 10px;
}
</style>
