<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 09:48:14
 * @LastEditTime: 2022-03-23 16:11:59
 * @LastEditors: truxcoder
 * @Description: 任职管理
-->
<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <personnel-option :is-clean="isClean" size="small" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item v-if="can.global" label="人员所属单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="任职级别" prop="levelId">
        <el-select v-model="searchForm.levelId" size="small" placeholder="请选择级别">
          <el-option v-for="i in levelList" :key="i.id" :label="i.name" :value="i.id" />
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
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="警号/工号" width="90" prop="policeCode" />
      <el-table-column label="担任职务" align="center" width="110" prop="positionName" />
      <el-table-column label="级别" align="center" width="70" prop="levelName" />
      <el-table-column label="任职单位" align="center" :show-overflow-tooltip="true" prop="organ" />
      <el-table-column label="任职部门" align="center" :show-overflow-tooltip="true" prop="department" />
      <el-table-column label="任职开始日期" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.startDay | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="任职结束日期" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.endDay | dateEndFilter }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <PostEdit :visible="editVisible" :action="action" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'

import PostEdit from './PostEdit.vue'

export default {
  name: 'Post',
  components: { PostEdit, PersonnelOption },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'post',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      levelList: [],
      searchForm: { personnelId: '', organParam: '', levelId: '' }
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
      this.fetchOtherData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans, params)
      request(this.resource, 'list', data, params).then(response => {
        if (response.count) {
          this.originData = response.data
          this.currentData = [...this.originData]
          this.count = response.count
        } else {
          this.originData = []
          this.currentData = []
          this.count = 0
        }
        this.listLoading = false
      })
    },
    fetchOtherData() {
      request('level', 'list').then(res => {
        this.levelList = res.data ?? []
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
