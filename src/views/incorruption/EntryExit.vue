<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 11:07:42
 * @LastEditTime: 2022-08-24 16:58:20
 * @LastEditors: truxcoder
 * @Description: 出入境管理
-->
<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" :form-item-width="formItemWidth" />
      </el-form-item>
      <el-form-item label="所用证件" prop="passport">
        <el-select v-model="searchForm.passport" size="small" :style="formItemWidth" filterable allow-create placeholder="请选择证件">
          <el-option v-for="i in options.passport" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="出境事由" prop="aim">
        <el-select v-model="searchForm.aim" size="small" :style="formItemWidth" filterable allow-create placeholder="请选择或输入事由">
          <el-option v-for="(v, i) in options.aim" :key="i" :label="v" :value="v" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否报备" prop="isReport">
        <el-select v-model="searchForm.isReport" :style="formItemWidth" size="small">
          <el-option v-for="i in options.isReport" :key="i.value" :label="i.label" :value="i.value" />
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
      <el-table-column align="center" label="单位" prop="organShortName" />
      <el-table-column align="center" label="姓名" width="120">
        <template slot-scope="scope">
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="警号/工号" width="100" prop="policeCode" />
      <el-table-column label="目的地" align="center">
        <template slot-scope="scope">
          {{ scope.row.destination }}
        </template>
      </el-table-column>
      <el-table-column label="出境事由" align="center">
        <template slot-scope="scope">
          {{ scope.row.aim }}
        </template>
      </el-table-column>
      <el-table-column label="出境时间" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.exitTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="入境时间" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.enterTime | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="所用证件" align="center" width="110">
        <template slot-scope="scope">
          {{ getPassport(scope.row.passport) }}
        </template>
      </el-table-column>
      <el-table-column label="是否报备" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.isReport | boolFilter }}
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
    <EntryExitEdit :visible="editVisible" :action="action" :row="rowData" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
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

import EntryExitEdit from './EntryExitEdit.vue'

import { passportDict, aimDict } from '@/utils/dict'

export default {
  name: 'EntryExit',
  components: { PersonnelOption, EntryExitEdit },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'entry_exit',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      formItemWidth: { width: '170px' },
      searchForm: { personnelId: '', passport: '', aim: '', isReport: '' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    options() {
      const bool = [
        { label: '是', value: 2 },
        { label: '否', value: 1 }
      ]
      const passport = [...passportDict]
      passport.shift()
      return { passport: passport, aim: aimDict, isReport: bool }
    },
    passportMap() {
      const map = new Map()
      passportDict.forEach(i => map.set(i.value, i.label))
      return map
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
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    getPassport(value) {
      return value ? this.passportMap.get(value) : '未定义'
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
