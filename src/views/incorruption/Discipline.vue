<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-04-18 10:49:13
 * @LastEditors: truxcoder
 * @Description:处分，前端分页
-->
<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="searchForm.category" size="small" placeholder="类别">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="处分项" prop="dictId">
        <el-select v-model="searchForm.dictId" size="small" placeholder="请选择处理项">
          <el-option v-for="i in disDictList" :key="i.id" :label="i.name" :value="i.id" />
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
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">
        添加
      </el-button>
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">
        删除
      </el-button>
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">
        所有数据
      </el-button>
      <el-button v-if="can.manage && can.global" type="primary" icon="el-icon-document" size="mini" @click="dictVisible = true">维护处分项字典</el-button>
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
      <el-table-column align="center" label="单位">
        <template slot-scope="scope">
          {{ scope.row.organShortName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="警号/工号">
        <template slot-scope="scope">
          {{ scope.row.policeCode }}
        </template>
      </el-table-column>
      <el-table-column label="处分类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.category && options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="处分项" align="center">
        <template slot-scope="scope">
          {{ scope.row.dictName }}
        </template>
      </el-table-column>
      <el-table-column label="处分时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.getTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="剩余影响期" align="center">
        <template slot-scope="scope">
          {{ scope.row.deadline | deadlineFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">
            编辑
          </el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
            详情
          </el-button>
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
    <DisciplineEdit :visible="editVisible" :action="action" :row="rowData" :dis-dict="disDict" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <DisciplineDetail :visible="detailVisible" :options="options" :row="rowData" @visibleChange="visibleChange" />
    <DisDict :visible="dictVisible" :list="disDict" :options="options" @dictChange="dictChange" @visibleChange="visibleChange" />
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

import DisciplineEdit from './DisciplineEdit.vue'
import DisciplineDetail from './DisciplineDetail.vue'
import DisDict from '@/views/incorruption/DisDict.vue'

export default {
  name: 'Discipline',
  components: { DisciplineEdit, PersonnelOption, DisciplineDetail, DisDict },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'discipline',
      queryMeans: 'frondEnd',
      originData: [],
      disDict: [],
      currentData: [],
      detailVisible: false,
      dictVisible: false,
      searchForm: { personnelId: '', category: '', dictId: '' }
    }
  },
  computed: {
    options() {
      const categoryOptions = [
        { label: '党纪处分', value: 1 },
        { label: '政务处分', value: 2 },
        { label: '处分', value: 3 }
      ]
      return {
        category: categoryOptions
      }
    },
    disDictList() {
      return this.disDict.filter(item => item.category === this.searchForm.category)
    }
  },
  created() {
    this.check().then(() => {
      this.fetchAllData()
    })
  },
  methods: {
    fetchAllData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans)
      const promises = [request(this.resource, 'list', data, params), request('dis_dict', 'list')]
      Promise.all(promises).then(responses => {
        this.originData = responses[0].data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []

        this.disDict = responses[1].data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans)
      request(this.resource, 'list', data, params).then(response => {
        this.originData = response.data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []
        this.listLoading = false
      })
    },
    fetchDictData() {
      request('dis_dict', 'list').then(response => {
        this.disDict = response.data
      })
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    dictChange() {
      this.fetchDictData()
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
