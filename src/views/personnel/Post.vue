<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 09:48:14
 * @LastEditTime: 2022-05-12 11:17:38
 * @LastEditors: truxcoder
 * @Description: 任职管理
-->
<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" :form-item-width="searchNameWidth" />
      </el-form-item>
      <el-form-item v-if="can.global" label="所属单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" :style="searchItemWidth" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
        <!-- <OrganSelect v-model="searchForm.organParam" :multiple="true" :width="searchItemWidth" /> -->
      </el-form-item>
      <el-form-item label="任职级别" prop="levelId">
        <el-select v-model="searchForm.levelId" size="small" :style="searchItemWidth" multiple placeholder="请选择级别">
          <el-option v-for="i in levelList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否实职" prop="isLeader">
        <el-select v-model="searchForm.isLeader" size="small" :style="searchItemWidth" placeholder="请选择">
          <el-option label="是" :value="2" />
          <el-option label="否" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="所任职务" prop="positionId">
        <el-select v-model="searchForm.positionId" size="small" :style="searchItemWidth" filterable multiple placeholder="请选择职务">
          <el-option v-for="i in positionList" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="现任" prop="current">
        <el-switch v-model="searchForm.current" />
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
    <PostEdit :visible="editVisible" :action="action" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
var _ = require('lodash/array')
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import { isEmpty } from '@/utils/validate'

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
      positionData: [],
      searchItemWidth: { width: '170px' },
      searchNameWidth: { width: '160px' },
      searchForm: { personnelId: '', organParam: '', levelId: '', positionId: '', isLeader: '', current: false }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    positionList() {
      return this.positionData.map(item => {
        return { label: item.name + ' 〔' + item.levelName + '〕', value: item.id }
      })
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
      this.interceptor(data, params)
      console.log('data:', data)
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
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    fetchOtherData() {
      // request('level', 'list').then(res => {
      //   this.levelList = res.data ?? []
      // })
      Promise.all([request('level', 'list'), request('position', 'list')]).then(responses => {
        this.levelList = responses[0].data ?? []
        this.positionData = responses[1].data ?? []
      })
    },
    // override onSearch，搜索后不清空搜索框
    onSearch() {
      const searchData = {}
      let searchParamNumber = 0
      for (const key in this.searchForm) {
        // if (this.searchForm[key] !== '') {
        if (!isEmpty(this.searchForm[key])) {
          if (Object.prototype.toString.call(this.searchForm[key]) === '[object String]' && (this.searchForm[key].includes("'") || this.searchForm[key].includes('or') || this.searchForm[key].includes('and') || this.searchForm[key].includes('--'))) {
            this.$message.error('查询参数包含非法字符!')
            return false
          }
          // 如果查询key不是organParam，则添加searchData中，否则往fetchData里传一个param，包含单位id, 以便buildParams接收。
          if (key !== 'organParam') {
            searchData[key] = this.searchForm[key]
          } else {
            this.queryParam = { organId: this.searchForm[key] }
          }
          searchParamNumber++
        } else if (key === 'organParam') {
          this.queryParam = {}
        }
      }
      if (!searchParamNumber) {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！'
        })
        return
      }
      this.searchData = searchData
      this.currentPage = 1
      this.fetchData(searchData, this.queryParam)
    },
    interceptor(data, params) {
      if ('current' in data) {
        if (data.current) {
          params.zero = 'end_day$time'
        }
        // delete data.current
      }
      if ('isLeader' in data) {
        const temp = this.positionData.filter(i => i.isLeader === data.isLeader).map(i => i.id)
        data.positionId = ('positionId' in data) ? _.intersection(data.positionId, temp) : temp
      }
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
