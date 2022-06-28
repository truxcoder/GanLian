<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-05-26 18:28:38
 * @LastEditors: truxcoder
 * @Description: 人才抽取，后端分页
-->
<template>
  <div>
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">抽取</el-button>
    </div>
    <el-table
      v-if="total"
      v-loading="listLoading"
      :data="queryMeans === 'backend' ? currentData : currentPageData"
      element-loading-text="Loading"
      stripe
      border
      :fit="true"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" label="抽取人" prop="pickerName" width="100" />
      <el-table-column label="日期" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.pickDate | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total"
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <TalentPickEdit :visible="editVisible" :action="action" :category="category" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <TalentPickDetail :visible="detailVisible" :row="rowData" @visibleChange="visibleChange" />

  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'

import { permission_mixin } from '@/common/mixin/permission'
import TalentPickEdit from './TalentPickEdit.vue'
import TalentPickDetail from './TalentPickDetail.vue'

export default {
  name: 'TalentPick',
  components: { TalentPickEdit, TalentPickDetail },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'talent',
      queryMeans: 'backEnd',
      originData: [],
      currentData: [],
      searchForm: { personnelId: '', category: '', dictId: '' }
    }
  },
  computed: {
    obj() {
      return this.$route.name
    },
    category() {
      return 1
    }
  },
  created() {
    this.check(this.obj).then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      // params = this.buildParams(this.queryMeans)
      request(this.resource, 'pick_list', data, params).then(response => {
        this.originData = response.data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    }
  }
}
</script>

<style scoped>
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
</style>
