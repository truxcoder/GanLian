<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 11:07:42
 * @LastEditTime: 2022-03-02 14:08:39
 * @LastEditors: truxcoder
 * @Description: 各类事项管理
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
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="单位" width="120">
        <template slot-scope="scope">
          {{ scope.row.organShortName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="120">
        <template slot-scope="scope">
          {{ scope.row.personnelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="警号/工号" width="100">
        <template slot-scope="scope">
          {{ scope.row.policeCode }}
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <AffairEdit :visible="editVisible" :action="action" :category="category" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <AffairDetail :visible="detailVisible" :row="rowData" @visibleChange="visibleChange" />
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

import AffairEdit from './AffairEdit.vue'
import AffairDetail from './AffairDetail.vue'

function getCategoryName(category) {
  switch (category) {
    case '1':
      return 'Audit'
    case '2':
      return 'PersonCheck'

    default:
      return ''
  }
}

export default {
  name: 'Affair',
  components: { PersonnelOption, AffairEdit, AffairDetail },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'affair',
      name: getCategoryName(this.$route.params.category),
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      searchForm: { personnelId: '', passport: '', aim: '', isReport: '' }
    }
  },
  computed: {
    params() {
      return this.$route.params
    },
    category() {
      return this.$route.params.category * 1
    }
  },
  watch: {
    params: function(val, oldval) {
      this.name = getCategoryName(val)
      this.check(this.name).then(() => {
        const data = { category: this.$route.params.category * 1 }
        this.fetchData(data)
      })
    }
  },
  created() {
    this.check(this.name).then(() => {
      const data = { category: this.$route.params.category * 1 }
      this.fetchData(data)
    })
    // this.$watch(
    //   () => this.$route.params,
    //   (toParams, previousParams) => {
    //     // 对路由变化做出响应...
    //   }
    // )
  },
  mounted() {
    console.log('category:', this.$route.params.category)
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
    getPassport(value) {
      return value ? this.passportMap.get(value) : '未定义'
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
