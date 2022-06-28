<!--
 * @Author: truxcoder
 * @Date: 2021-11-24 17:16:26
 * @LastEditTime: 2022-05-26 10:59:24
 * @LastEditors: truxcoder
 * @Description: 人才库，后端分页
-->
<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="onClean">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加</el-button>
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
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
      <el-table-column align="center" label="单位" prop="organShortName" width="100" />
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" prop="gender" width="55" />
      <el-table-column align="center" label="警号/工号" prop="policeCode" width="100" />
      <el-table-column label="年龄" width="55" align="center">
        <template slot-scope="scope">
          {{ scope.row.birthday | ageFilter }}
        </template>
      </el-table-column>
      <el-table-column label="取得考官证时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.beExaminerDay | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位标签">
        <template slot-scope="scope">
          {{ scope.row.skill | skillFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <TalentEdit :visible="editVisible" :action="action" :category="category" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
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

import TalentEdit from './TalentEdit.vue'
import { talentObj } from '@/utils/talent'
import { isEmpty } from 'lodash/lang'

export default {
  name: 'Talent',
  components: { TalentEdit, PersonnelOption },
  filters: {
    skillFilter(v) {
      if (!isEmpty(v)) {
        return JSON.parse(v).toLocaleString()
      }
      return '无'
    }
  },
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
      const map = {}
      talentObj.forEach((v, i) => {
        map[v.name] = i + 1
      })
      return map[this.obj]
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
      params = this.buildParams(this.queryMeans)
      request(this.resource, 'list/' + this.category, data, params).then(response => {
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
