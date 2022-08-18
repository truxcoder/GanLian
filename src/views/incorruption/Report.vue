<template>
  <div class="app-container">
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">
        添加
      </el-button>
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData(102)">
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
      <el-table-column align="left" label="标题" min-width="300" show-overflow-tooltip prop="title" />
      <el-table-column align="center" label="涉及人员" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.personnels | personList }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前阶段" width="150">
        <template slot-scope="scope">
          {{ scope.row.step | stepFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">
            编辑
          </el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.row, 102)">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="handleStep(scope.row)">
            阶段
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
    <report-edit :visible="editVisible" :action="action" :row="rowData" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <report-step :visible="stepVisible" :edit-visible="stepEditVisible" :options="options" :row="rowData" @visibleChange="visibleChange" @stepVisibleChange="stepVisibleChange" />
    <report-detail :visible="detailVisible" :options="options" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/pre_delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'

import { permission_mixin } from '@/common/mixin/permission'

import ReportEdit from './ReportEdit.vue'
import ReportStep from './ReportStep.vue'
import ReportDetail from './ReportDetail.vue'

export default {
  name: 'Report',
  components: { ReportEdit, ReportStep, ReportDetail },
  filters: {
    personList(arr) {
      if (!arr) {
        return '无'
      }
      return arr.map(item => item.name).join(', ')
    },
    stepFilter(step) {
      let result
      switch (step) {
        case 1:
          result = '谈话函询阶段'
          break
        case 2:
          result = '初步核查阶段'
          break
        case 3:
          result = '立案查询调查阶段'
          break
        case 100:
          result = '调查完结(属实)'
          break
        case 99:
          result = '调查完结(不属实)'
          break

        default:
          result = '未定义'
          break
      }
      return result
    }
  },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'report',
      queryMeans: 'frondEnd',
      originData: [],
      currentData: [],
      detailVisible: false,
      stepVisible: false,
      stepEditVisible: false,
      action: '',
      searchForm: { personnelId: '', category: '', dictId: '' }
    }
  },
  computed: {
    options() {
      const step = [
        { label: '谈话函询阶段', value: 1 },
        { label: '初步核查阶段', value: 2 },
        { label: '立案审查调查阶段', value: 3 },
        { label: '调查完结结果属实', value: 100 },
        { label: '调查完结结果不属实', value: 99 }
      ]
      return {
        step
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
    handleEdit(act, row) {
      this.action = act
      if (act === 'add') {
        this.rowData = {}
      } else {
        this.rowData = row
      }
      this.editVisible = true
    },
    handleStep(row) {
      this.rowData = row
      this.stepVisible = true
    },
    stepVisibleChange() {
      this.stepEditVisible = !this.stepEditVisible
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
