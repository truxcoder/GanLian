<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <personnel-option :is-clean="isClean" size="small" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="单位" prop="organId">
        <el-select v-model="searchForm.organId" size="small" placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="years">
        <el-select v-model="searchForm.years" size="small" :style="searchItemWidth" placeholder="请选择年份">
          <el-option v-for="i in options.years" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="季度" prop="season">
        <el-select v-model="searchForm.season" size="small" :style="searchItemWidth" placeholder="请选择季度">
          <el-option v-for="i in options.season" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="结果" prop="conclusion">
        <el-select v-model="searchForm.conclusion" size="small" :style="searchItemWidth" placeholder="请选择结果">
          <el-option v-for="i in options.conclusion" :key="i" :label="i" :value="i" />
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
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addVisible = true">添加</el-button>
      <el-button v-if="total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <div class="tableZone">
      <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="人员">
          <template slot-scope="scope">
            {{ scope.row.personnelName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="警号/工号">
          <template slot-scope="scope">
            {{ scope.row.policeCode }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核单位">
          <template slot-scope="scope">
            {{ scope.row.organShortName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核年份">
          <template slot-scope="scope">
            {{ scope.row.years }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核季度">
          <template slot-scope="scope">
            {{ scope.row.season | seasonFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="考核结果">
          <template slot-scope="scope">
            {{ scope.row.conclusion }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <appraisal-add :visible="addVisible" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <appraisal-update :visible="updateVisible" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
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

import AppraisalAdd from './AppraisalAdd.vue'
import AppraisalUpdate from './AppraisalUpdate.vue'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'

export default {
  name: 'Appraisal',
  components: { AppraisalAdd, AppraisalUpdate, PersonnelOption },
  filters: {
    seasonFilter(season) {
      let result = '未知'
      seasonDict.forEach(item => {
        if (season === item.value) {
          result = item.label
          return
        }
      })
      return result
    }
  },
  mixins: [common_mixin, delete_mixin, list_mixin, permission_mixin, search_mixin],
  data() {
    return {
      resource: 'appraisal',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      organMap: {},
      searchForm: { personnelId: '', organId: '', years: '', season: '', conclusion: '' },
      searchItemWidth: { width: '130px' }
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
      const conclusion = conclusionDict
      return {
        organ: this.$store.getters.organs,
        years,
        conclusion,
        season: seasonDict
      }
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
      params = this.buildParams(this.queryMeans)
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
      })
    },
    handleAllData() {
      this.searchData = {}
      this.currentPage = 1
      this.fetchData()
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
