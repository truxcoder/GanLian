<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-08-31 09:48:19
 * @LastEditors: truxcoder
 * @Description:培训，后端分页
-->
<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="培训标题" prop="title">
        <el-input v-model="searchForm.title" size="small" :style="formTitleWidth" placeholder="培训标题" />
      </el-form-item>
      <el-form-item label="主办单位" prop="sponsor">
        <el-select v-model="searchForm.sponsor" size="small" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
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
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">
        添加
      </el-button>
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">
        删除
      </el-button>
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">
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
      <el-table-column align="center" type="selection" width="55" :selectable="isRowCanSelect" />
      <el-table-column align="left" label="标题" show-overflow-tooltip prop="title" />
      <el-table-column align="center" label="主办单位" width="150" show-overflow-tooltip prop="sponsor" />
      <el-table-column align="center" label="承办单位" width="150" show-overflow-tooltip prop="organizer" />
      <el-table-column label="录入单位" align="center" width="100">
        <template slot-scope="scope">
          {{ getOrganName(scope.row.organId) }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.startTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-link v-if="isRowCanUpdate(scope.row)" type="success" class="oper-btn" :underline="false" @click="handleEdit('update', scope.row)">编辑</el-link>
          <el-link v-if="isRowCanSelect(scope.row)" type="danger" class="oper-btn" :underline="false" @click="handleDelete(scope.$index, scope.row.id)">删除</el-link>
          <el-link type="primary" class="oper-btn" :underline="false" @click="handleDetail(scope.row)">详情</el-link>
          <el-link type="primary" class="oper-btn" :underline="false" @click="selectPerson(scope.row)">参加人员</el-link>
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
    <TrainingEdit :visible="editVisible" :action="action" :row="rowData" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
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

import TrainingEdit from './TrainingEdit.vue'
import TrainingPersonnel from './TrainingPersonnel.vue'
import TrainingDetail from './TrainingDetail.vue'

import { trainingMethodOption, trainingCategoryOption, trainingMethodDict, trainingCategoryDict } from '@/utils/dict'

export default {
  name: 'Training',
  components: { TrainingEdit, TrainingDetail, TrainingPersonnel },
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
      formItemWidth: { width: '220px' },
      searchForm: { title: '', sponsor: '' }
    }
  },
  computed: {
    organMap() {
      const newMap = {}
      this.$store.getters.organs.forEach(item => (newMap[item.id] = item))
      return newMap
    },
    options() {
      // const departmentOptions = this.$store.getters.departments.map(item => {
      //   const parent = this.organMap[item.busOrgCode] ? this.organMap[item.busOrgCode].name : ' '
      //   return { label: item.name + ' 〔' + parent + '〕', value: item.name }
      // })
      const yesOrNo = [
        { label: '是', value: 2 },
        { label: '否', value: 1 }
      ]
      return {
        organ: this.$store.getters.organs,
        yesOrNo,
        method: trainingMethodOption,
        category: trainingCategoryOption,
        methodDict: trainingMethodDict,
        categoryDict: trainingCategoryDict
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
      // 如果不具备全局权限，则向后台传递organId参数。以便后台过滤掉其他单位的数据。
      if (!this.can.global) {
        params.organId = this.$store.getters.organ
      }
      params = this.buildParams(this.queryMeans, params)
      request(this.resource, 'list', data, params).then(response => {
        this.originData = response.data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []
        this.count = response.count
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    selectPerson(row) {
      this.rowData = row
      this.personnelVisible = true
    },
    isMyOrgan(id) {
      return id === this.$store.getters.organ
    },
    isRowCanSelect(row, index) {
      if (this.can.global && this.can.delete) {
        return true
      }
      return this.can.delete && row.organId === this.$store.getters.organ
    },
    isRowCanUpdate(row, index) {
      if (this.can.global && this.can.update) {
        return true
      }
      return this.can.update && row.organId === this.$store.getters.organ
    },
    getOrganName(id) {
      return this.organMap[id]?.shortName ?? ''
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
.oper-btn {
  font-size: 12px;
  margin: 0 5px;
}
</style>
