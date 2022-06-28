<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" :form-item-width="searchItemWidth" />
      </el-form-item>
      <!-- <el-form-item v-if="can.global" label="单位" prop="organParam">
        <OrganSelect v-model="searchForm.organParam" :width="searchItemWidth" />
      </el-form-item> -->
      <el-form-item v-if="can.global" label="单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" :style="searchItemWidth" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="年份" prop="years">
        <el-select v-model="searchForm.years" size="small" :style="searchItemWidth" multiple placeholder="请选择年份">
          <el-option v-for="i in options.years" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="季度" prop="season">
        <el-select v-model="searchForm.season" size="small" :style="searchItemWidth" multiple placeholder="请选择季度">
          <el-option v-for="i in options.season" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="结果" prop="conclusion">
        <el-select v-model="searchForm.conclusion" size="small" :style="searchItemWidth" placeholder="请选择结果">
          <el-option v-for="i in conclusionList" :key="i.value" :label="i.value" :value="i.value" />
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
      <el-button v-if="can.manage" type="success" icon="el-icon-folder-add" size="mini" @click="batchVisible = true">批量录入</el-button>
      <el-button v-if="total && can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <div class="tableZone">
      <el-table
        v-loading="listLoading"
        :data="currentData"
        element-loading-text="Loading"
        stripe
        border
        :fit="true"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="单位" prop="organShortName" width="100" />
        <el-table-column align="center" label="人员">
          <template slot-scope="scope">
            <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="警号/工号" prop="policeCode" />
        <el-table-column align="center" label="考核单位" width="240" show-overflow-tooltip prop="organ" />
        <el-table-column align="center" label="考核年份" prop="years" />
        <el-table-column align="center" label="考核季度">
          <template slot-scope="scope">
            {{ itemMap.get(scope.row.season) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核结果" prop="conclusion" />
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    <AppraisalEdit :visible="editVisible" :action="action" :row="rowData" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <AppraisalBatchEdit :visible="batchVisible" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'

import { conclusionDict, seasonDict } from '@/utils/dict'

import AppraisalEdit from './AppraisalEdit.vue'
import AppraisalBatchEdit from './AppraisalBatchEdit.vue'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import isEmpty from 'lodash/isEmpty'

export default {
  name: 'Appraisal',
  components: { AppraisalEdit, AppraisalBatchEdit, PersonnelOption },
  mixins: [common_mixin, delete_mixin, list_mixin, permission_mixin, search_mixin],
  data() {
    return {
      resource: 'appraisal',
      queryMeans: 'backend',
      batchVisible: false,
      originData: [],
      currentData: [],
      organMap: {},
      searchForm: { personnelId: '', organParam: '', years: '', season: '', conclusion: '' },
      searchItemWidth: { width: '160px' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    options() {
      const years = []
      for (let index = 2010; index < 2030; index++) {
        years.push({ label: index + '年', value: index + '' })
      }
      return {
        organ: this.$store.getters.organs,
        years,
        season: seasonDict
      }
    },
    items() {
      return [
        { key: 'personnelId', label: '人员' },
        { key: 'organId', label: '单位' },
        { key: 'years', label: '年份', type: 'select', placeholder: '请选择年份', option: this.options.years },
        { key: 'season', label: '季度', type: 'select', placeholder: '请选择季度', option: this.options.season },
        { key: 'conclusion', label: '结果', type: 'select', placeholder: '请选择结果', option: this.options.conclusion }
      ]
    },
    conclusionList() {
      return conclusionDict.filter(item => {
        if (isEmpty(this.searchForm.season)) {
          return false
        } else if (this.searchForm.season.length === 1 && this.searchForm.season[0] === 100) {
          return item.category === 1
        } else if (!this.searchForm.season.includes(100)) {
          return item.category === 2
        } else {
          return true
        }
        // switch (this.searchForm.season) {
        //   case 100:
        //     return item.category === 1
        //   case '':
        //     return false
        //   default:
        //     return item.category === 2
        // }
      })
    },
    itemMap() {
      const _map = new Map()
      seasonDict.forEach(item => {
        _map.set(item.value, item.label)
      })
      return _map
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans, params)
      request('appraisal', 'list', data, params).then(response => {
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
