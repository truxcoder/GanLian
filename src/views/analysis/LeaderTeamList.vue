<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 09:48:14
 * @LastEditTime: 2023-04-28 10:45:19
 * @LastEditors: truxcoder
 * @Description: 任职管理
-->
<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-if="can.global" label="所属单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" :style="searchItemWidth" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加</el-button>
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="所属班子" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.organShortName + '党委' }}
        </template>
      </el-table-column>
      <el-table-column label="警号/工号" align="center" width="90" prop="policeCode" />
      <el-table-column label="是否为一把手" align="center" width="110">
        <template slot-scope="scope">
          {{ scope.row.isBoss === 2 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="是否为正职" align="center" width="110">
        <template slot-scope="scope">
          {{ scope.row.isChief === 2 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="90" prop="sort" />
      <el-table-column label="备注" align="center" prop="remark" />

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <LeaderTeamEdit :visible="editVisible" :action="action" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'

import LeaderTeamEdit from './LeaderTeamEdit.vue'

export default {
  name: 'LeaderTeamList',
  components: { LeaderTeamEdit },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'leader',
      originData: [],
      currentData: [],
      levelList: [],
      positionData: [],
      searchItemWidth: { width: '170px' },
      searchNameWidth: { width: '160px' },
      searchForm: { organParam: '' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    }
  },
  created() {
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans, params)
      request(this.resource, 'list', data, params).then(response => {
        if (response.data) {
          this.originData = response.data
          this.currentData = [...this.originData]
          this.count = response.count
        } else {
          this.originData = []
          this.currentData = []
          this.count = 0
        }
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
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
