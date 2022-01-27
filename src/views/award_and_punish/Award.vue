<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-01-25 17:44:23
 * @LastEditors: truxcoder
 * @Description:奖励信息，后端分页
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
      <el-form-item label="类别" prop="category">
        <el-select v-model="searchForm.category" size="small" placeholder="类别">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="等级/奖励项" prop="grade">
        <el-select v-model="searchForm.grade" size="small" placeholder="请选择等级/奖励项">
          <el-option v-for="i in gradeList" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="onClean">清空</el-button>
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
    <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.personnelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="警号/工号">
        <template slot-scope="scope">
          {{ scope.row.policeCode }}
        </template>
      </el-table-column>
      <el-table-column label="奖励类型" align="center">
        <template slot-scope="scope">
          {{ options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="奖励项/等级" align="center">
        <template slot-scope="scope">
          {{ options.grade[scope.row.grade - 1] && options.grade[scope.row.grade - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="奖励时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.getTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="奖励文号" align="center">
        <template slot-scope="scope">
          {{ scope.row.docNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
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
    <award-add :visible="addVisible" :options="options" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <award-update :visible="updateVisible" :options="options" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
    <award-detail :visible="detailVisible" :options="options" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'
import { awardCategory, awardGrade } from '@/utils/dict'

import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import AwardAdd from './AwardAdd.vue'
import AwardUpdate from './AwardUpdate.vue'
import AwardDetail from './AwardDetail.vue'

export default {
  name: 'Award',
  components: { AwardAdd, AwardUpdate, PersonnelOption, AwardDetail },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'award',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      detailVisible: false,
      searchForm: { personnelId: '', category: '', grade: '' }
    }
  },
  computed: {
    options() {
      const categoryOptions = awardCategory
      const gradeOptions = awardGrade
      return {
        category: categoryOptions,
        grade: gradeOptions
      }
    },
    gradeList() {
      return this.options.grade.filter(item => item.category === this.searchForm.category)
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
    handleAllData() {
      this.searchData = {}
      this.currentPage = 1
      this.fetchData()
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
