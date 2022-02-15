<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-02-10 11:25:45
 * @LastEditors: truxcoder
 * @Description:培训，后端分页
-->
<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="培训标题" prop="title">
        <el-input v-model="searchForm.title" size="small" :style="formTitleWidth" placeholder="培训标题" />
      </el-form-item>
      <el-form-item label="组织单位" prop="organ">
        <el-select v-model="searchForm.organ" size="small" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>

        <!-- <el-button type="primary" size="small" icon="el-icon-delete" @click="onClean">清空</el-button> -->
        <!-- <el-button-group>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" @click="onClean">清空</el-button>
        </el-button-group> -->
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addVisible = true">
        添加
      </el-button>
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">
        删除
      </el-button>
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">
        所有数据
      </el-button>
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
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组织单位" width="300">
        <template slot-scope="scope">
          {{ scope.row.organ }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" width="160">
        <template slot-scope="scope">
          {{ scope.row.startTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
            详情
          </el-button>
          <el-button size="mini" type="primary" @click="selectPerson(scope.row)">
            参加人员
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
    <training-add :visible="addVisible" :options="options" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <training-update :visible="updateVisible" :options="options" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
    <training-detail :visible="detailVisible" :options="options" :row="rowData" @visibleChange="visibleChange" />
    <training-personnel :visible="personnelVisible" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'

import { permission_mixin } from '@/common/mixin/permission'

import TrainingAdd from './TrainingAdd.vue'
import TrainingPersonnel from './TrainingPersonnel.vue'
import TrainingUpdate from './TrainingUpdate.vue'
import TrainingDetail from './TrainingDetail.vue'

export default {
  name: 'Training',
  components: { TrainingAdd, TrainingUpdate, TrainingDetail, TrainingPersonnel },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'training',
      queryMeans: 'backend',
      originData: [],
      disDict: [],
      currentData: [],
      detailVisible: false,
      personnelVisible: false,
      formTitleWidth: { width: '500px' },
      searchForm: { title: '', organ: '' }
    }
  },
  computed: {
    organMap() {
      const newMap = {}
      this.$store.getters.organs.forEach(item => (newMap[item.busOrgCode] = item))
      return newMap
    },
    options() {
      const departmentOptions = this.$store.getters.departments.map(item => {
        const parent = this.organMap[item.busOrgCode] ? this.organMap[item.busOrgCode].name : ' '
        return { label: item.name + ' 〔' + parent + '〕', value: item.name }
      })
      const property = [
        { label: '系统内培训', value: 1 },
        { label: '系统外培训', value: 2 }
      ]
      return {
        organ: this.$store.getters.organs,
        department: departmentOptions,
        property
      }
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
      params = this.buildParams(this.queryMeans)
      request(this.resource, 'list', data, params).then(response => {
        this.originData = response.data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []
        this.count = response.count
        this.listLoading = false
      })
    },

    handleAllData() {
      this.searchData = {}
      this.currentPage = 1
      this.fetchData()
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    selectPerson(row) {
      this.rowData = row
      this.personnelVisible = true
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
