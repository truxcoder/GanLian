<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 11:07:42
 * @LastEditTime: 2022-08-08 14:39:06
 * @LastEditors: truxcoder
 * @Description: 各类事项管理
-->
<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item v-if="can.global" label="单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" />
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
      <el-button v-if="can.delete && total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData(category + 102)">删除</el-button>
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
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
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
          <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.row, category + 102)">删除</el-button>
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
import { delete_mixin } from '@/common/mixin/pre_delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'

import AffairEdit from './AffairEdit.vue'
import AffairDetail from './AffairDetail.vue'

export default {
  name: 'Affair',
  components: { PersonnelOption, AffairEdit, AffairDetail },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'affair',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      isPerDetailPage: false,
      searchForm: { personnelId: '', passport: '', aim: '', isReport: '' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    params() {
      return this.$route.params
    },
    category() {
      switch (this.$route.name) {
        case 'Audit':
          return 1
        case 'PersonCheck':
          return 2
        case 'Inspection':
          return 3
        default:
          return 0
      }
    }
  },
  // watch: {
  //   params: function(val, oldval) {
  //     this.name = getCategoryName(val)
  //     this.check(this.name).then(() => {
  //       const data = { category: this.$route.params.category * 1 }
  //       this.fetchData(data)
  //     })
  //   }
  // },
  created() {
    this.check(this.$route.name).then(() => {
      this.fetchData()
    })
    // this.$watch(
    //   () => this.$route.params,
    //   (toParams, previousParams) => {
    //     // 对路由变化做出响应...
    //   }
    // )
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans, params)
      request(this.resource, 'list/' + this.category, data, params).then(response => {
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
