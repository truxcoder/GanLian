<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-if="can.global" label="单位" prop="organId">
        <el-select v-model="searchForm.organId" :style="formItemWidth" size="small" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name" :style="formItemWidth" size="small" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="警号/工号" prop="policeCode">
        <el-input v-model="searchForm.policeCode" :style="formItemWidth" size="small" placeholder="警号/工号" />
      </el-form-item>
      <el-form-item label="级别" prop="level">
        <el-select v-model="searchForm.level" :style="formItemWidth" size="small" placeholder="请选择级别" multiple>
          <el-option v-for="i in levelList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>

      <el-form-item v-if="can.special">
        <el-button type="success" size="small" icon="el-icon-search" @click="searchVisible = true">高级查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
      <el-button v-if="can.manage" type="primary" icon="el-icon-scjd-circle-forbidden iconfont" size="mini" @click="fetchDisabledData">查看禁用人员</el-button>
      <el-button v-if="can.special" v-show="!quickSearchBoxShow" type="success" icon="el-icon-arrow-down" size="mini" @click=" onQuickSearchBoxShow">展开快捷查询</el-button>
      <el-button v-if="can.special" v-show="quickSearchBoxShow" type="success" icon="el-icon-arrow-up" size="mini" @click=" onQuickSearchBoxShow">收缩快捷查询</el-button>
      <el-dropdown v-if="can.manage" class="data-export" @command="handleCommand">
        <el-button type="primary" icon="el-icon-download" size="mini">
          数据导出<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="select">导出所选数据</el-dropdown-item>
          <el-dropdown-item command="all">导出全部数据</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <CollapseTransition>
      <div v-show="quickSearchBoxShow" ref="quickSearchBox">
        <div class="border pb-4 mb-4">
          <div class="quick-buttons">
            <el-button size="small" type="success" plain @click="onQuickSearch('fc')">符合副处级领导干部选拔条件人员</el-button>
            <el-popover
              placement="bottom-start"
              title="条件说明"
              width="500"
              trigger="hover"
              content="工龄≥5年。下一级两个及以上职位任职经历。下一职级（正科级）任职时间≥3年。学历:大专及以上。通过县处级领导干部考试且在三年有效期内。前三年年度考核称职及以上。政治面貌为中共党员。三年以上党龄。"
            >
              <li slot="reference" style="color:grey; margin-left:5px" class="el-icon-question" />
            </el-popover>
          </div>

          <div class="quick-buttons">
            <el-button size="small" type="success" plain @click="onQuickSearch('zc')">符合副处级晋升正处级条件人员</el-button>
            <el-popover
              placement="bottom-start"
              title="条件说明"
              width="500"
              trigger="hover"
              content="工龄≥5年。下一级两个及以上职位任职经历。下一职级（副处级）任职时间≥2年。学历:大专及以上。通过县处级领导干部考试且在三年有效期内。前三年年度考核称职及以上。政治面貌为中共党员。三年以上党龄。"
            >
              <li slot="reference" style="color:grey; margin-left:5px" class="el-icon-question" />
            </el-popover>
          </div>
          <div class="quick-buttons">
            <el-button size="small" type="success" plain @click="onQuickSearch('willUpInSixMonth')">半年内将晋升职级的人员</el-button>
            <el-popover
              placement="bottom-start"
              title="条件说明"
              width="500"
              trigger="hover"
              content="现任职级(非领导职务)为一级警长以下。现职级任职时间已满18个月。"
            >
              <li slot="reference" style="color:grey; margin-left:5px" class="el-icon-question" />
            </el-popover>
          </div>
          <div class="quick-buttons">
            <el-button size="small" type="success" plain @click="onQuickSearch('willUpInThreeMonth')">三个月内将晋升职级的人员</el-button>
            <el-popover
              placement="bottom-start"
              title="条件说明"
              width="500"
              trigger="hover"
              content="现任职级(非领导职务)为一级警长以下。现职级任职时间已满21个月。"
            >
              <li slot="reference" style="color:grey; margin-left:5px" class="el-icon-question" />
            </el-popover>
          </div>
          <div class="quick-buttons">
            <el-button size="small" type="success" plain @click="onQuickSearch('willRetireInTwoYear')">两年内将退休的人员</el-button>
            <el-popover
              placement="bottom-start"
              title="条件说明"
              width="500"
              trigger="hover"
              content="男民警已满58岁，女民警已满53岁。"
            >
              <li slot="reference" style="color:grey; margin-left:5px" class="el-icon-question" />
            </el-popover>
          </div>
          <div class="quick-buttons">
            <el-dropdown class="data-export" @command="handleQuickSearchCommand">
              <el-button size="small" type="success" plain>
                符合职级晋升条件的人员<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="willUp2d">二级调研员</el-dropdown-item>
                <el-dropdown-item command="willUp3d">三级调研员</el-dropdown-item>
                <el-dropdown-item command="willUp4d">四级调研员</el-dropdown-item>
                <el-dropdown-item command="willUp1z">一级主任科员</el-dropdown-item>
                <el-dropdown-item command="willUp2z">二级主任科员</el-dropdown-item>
                <el-dropdown-item command="willUp3z">三级主任科员</el-dropdown-item>
                <el-dropdown-item command="willUp4z">四级主任科员</el-dropdown-item>
                <el-dropdown-item command="willUp1k">一级科员</el-dropdown-item>
                <el-dropdown-item command="willUp2g">二级高级警长</el-dropdown-item>
                <el-dropdown-item command="willUp3g">三级高级警长</el-dropdown-item>
                <el-dropdown-item command="willUp4g">四级高级警长</el-dropdown-item>
                <el-dropdown-item command="willUp1j">一级警长</el-dropdown-item>
                <el-dropdown-item command="willUp2j">二级警长</el-dropdown-item>
                <el-dropdown-item command="willUp3j">三级警长</el-dropdown-item>
                <el-dropdown-item command="willUp4j">四级警长</el-dropdown-item>
                <el-dropdown-item command="willUp1y">一级警员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </CollapseTransition>
    <!-- <transition name="fade">

    </transition> -->

    <el-table
      v-loading="listLoading"
      :data="queryMeans === 'backend' ? currentData : currentPageData"
      element-loading-text="Loading"
      stripe
      border
      :fit="true"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="can.manage" align="center" type="selection" width="50" />
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center" width="120">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.organShortName }">{{ scope.row.organShortName ? scope.row.organShortName : '未定义' }}</span>
          <!-- <span :class="{'text_red':!scope.row.organId}">{{ scope.row.organId ? getOrganName(scope.row.organId, "short") : '未定义' }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: !scope.row.departmentShortName }">{{ scope.row.departmentShortName ? scope.row.departmentShortName : '未定义' }}</span>
          <!-- <span :class="{'text_red':!scope.row.organId}">{{ scope.row.organId ? getOrganName(scope.row.organId, "short") : '未定义' }}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <el-link @click="handleTable(scope.$index, scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="级别" width="90">
        <template slot-scope="scope">
          {{ scope.row.currentLevel === 0 ? '一般民警' : levelMap[scope.row.currentLevel] }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" width="100" label="警号/工号" prop="policeCode" :show-overflow-tooltip="true" />
      <el-table-column label="性别" prop="gender" width="60" align="center" />
      <el-table-column label="年龄" width="60" align="center">
        <template slot-scope="scope">
          <span :class="{ text_red: isBirthdayZero(scope.row.birthday) }">{{ scope.row.birthday | ageFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" prop="nation" width="75" align="center" />
      <el-table-column label="政治面貌" prop="political" align="center" width="100" />
      <el-table-column align="center" label="操作" :width="lastColumnWidth">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button> -->
          <el-button v-if="can.manage" size="mini" :type="scope.row.status?'danger':'success'" @click="handleDisable(scope.row)">{{ scope.row.status?'禁用':'启用' }}</el-button>
          <el-button size="mini" type="primary" @click="handleTable(scope.$index, scope.row)">一览</el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
    <PersonnelEdit :visible="editVisible" :action="action" :row="rowData" :can="can" :is-parent-list="true" @editSuccess="editSuccess" @visibleChange="visibleChange" />

    <!-- <personnel-update :visible="updateVisible" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" /> -->
    <PersonnelSearch :visible="searchVisible" :can="can" :levels="levelList" @advanceSearch="advanceSearch" @visibleChange="visibleChange" />
    <PersonnelDataExport :visible="exportVisible" :all="exportData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import remoteDepartmentData from '@/api/departmentData.json'
import { request } from '@/api'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'

import { permission_mixin } from '@/common/mixin/permission'
import PersonnelSearch from './PersonnelSearch'
// import PersonnelUpdate from './PerUpdate'
import PersonnelEdit from './PerEdit.vue'
import PersonnelDataExport from './PersonnelDataExport.vue'
import CollapseTransition from '@/utils/collapse-transition.js'

export default {
  name: 'Personnel',
  components: { PersonnelEdit, PersonnelSearch, CollapseTransition, PersonnelDataExport },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'personnel',
      // queryMeans: 'backend',
      queryMeans: 'frontend',
      originData: [],
      currentData: [],
      exportData: [],
      searchVisible: false,
      exportVisible: false,
      quickSearchBoxShow: false,
      levelList: [],
      formItemWidth: { width: '170px' },
      searchForm: {
        name: '',
        policeCode: '',
        organId: '',
        level: ''
      }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    lastColumnWidth() {
      if (this.can.manage) {
        return 280
      } else if (this.can.update) {
        return 220
      } else {
        return 160
      }
    },
    levelMap() {
      const _map = {}
      this.levelList.forEach(i => {
        _map[i.id] = i.name
      })
      return _map
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    if (this.$store.getters.custom.length === 0) {
      this.$store.dispatch('account/changeCustom', { category: 1, accountId: this.$store.getters.id })
    }
    this.check().then(() => {
      this.fetchData()
      this.fetchOtherData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      // params.currentPage = this.currentPage
      // params.pageSize = this.pageSize
      // params.queryMeans = this.queryMeans
      const organId = this.can.global ? [] : [this.$store.getters.organ]
      if (!Object.keys(data).includes('organId')) {
        data = { ...data, organId }
      } else if (data.organId.length === 0) {
        data.organId = organId
      }
      if (!('status' in data)) {
        data = { ...data, status: true }
      }
      request('personnel', 'list', data, params).then(response => {
        // if (response?.count) {
        if (response.data.length) {
          this.originData = response.data
          this.currentData = [...this.originData]
          // this.count = response.count
          this.listLoading = false
        } else {
          this.originData = []
          this.currentData = []
          // this.count = 0
          this.listLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    fetchOtherData() {
      request('level', 'list').then(res => {
        this.levelList = res.data ?? []
      })
    },
    // 获取禁用人员数据
    fetchDisabledData() {
      this.searchData = { status: false }
      this.currentPage = 1
      this.searchVisible = false
      this.fetchData(this.searchData)
    },
    handleDetail(index, row) {
      const url = this.$router.resolve({
        path: '/perdetail',
        query: { id: row.id }
      })
      window.open(url.href, '_blank')
      // this.$router.push({ path: 'pdetail' })
    },
    handleTable(index, row) {
      const width = 700
      const windowWidth = window.window.innerWidth
      const left = (windowWidth - width) / 2
      const height = window.window.innerHeight
      const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},left=${left},top=0`
      const url = this.$router.resolve({
        path: '/pertable',
        query: { id: row.id }
      })
      open(url.href, 'name', params)
      // this.$router.push({ path: 'pdetail' })
    },
    advanceSearch(data) {
      this.searchData = data
      this.currentPage = 1
      this.searchVisible = false
      this.fetchData(data)
    },
    onQuickSearchBoxShow() {
      this.quickSearchBoxShow = !this.quickSearchBoxShow
    },
    onQuickSearch(key) {
      const data = { extra: key }
      this.advanceSearch(data)
    },
    isBirthdayZero(birthday) {
      return dayjs(birthday).year() === 1
    },
    handleDisable(row) {
      const message = row.status ? '将禁用该人员, 是否确定?' : '将启用该人员, 是否确定?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request('personnel', 'update_status', { id: row.id, status: !row.status })
            .then(response => {
              this.$message.success(response.message)
              this.$set(row, 'status', !row.status)
              // this.fetchData()
            })
            .catch(err => { console.log(err) })
        })
        .catch(() => { this.$message.info('已取消禁用') })
    },
    handleCommand(command) {
      if (command === 'select') {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('未选择任何数据')
          return
        }
        this.exportData = this.multipleSelection
      } else if (command === 'all') {
        this.exportData = this.currentData
      } else {
        this.$message.warning('数据错误')
        return
      }
      this.exportVisible = true
    },
    handleQuickSearchCommand(command) {
      this.onQuickSearch(command)
    },
    onClean() {
      this.$refs.searchForm.resetFields()
      this.$set(this.searchForm, 'level', '')
      this.$set(this.searchForm, 'organId', '')
      this.$set(this.searchForm, 'policeCode', '')
      // this.queryParam = {}
      this.isClean = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
.data-export {
  margin-left: 10px;
}
.pagination {
  margin-top: 15px;
}
// .myfont {
//   @extend .iconfont;
// }
#load-more ::v-deep .el-link--inner {
  text-align: center;
}

.quick-buttons {
  display: inline-block;
  padding-left: 16px;
  padding-top: 16px;
}

</style>
