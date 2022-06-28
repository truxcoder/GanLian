<!--
 * @Author: truxcoder
 * @Date: 2022-05-18 10:22:51
 * @LastEditTime: 2022-06-24 11:44:07
 * @LastEditors: truxcoder
 * @Description: 数据审核
-->

<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="提交人" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" :form-item-width="searchNameWidth" />
      </el-form-item>
      <el-form-item v-if="can.global" label="所属单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" :style="searchItemWidth" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
        <!-- <OrganSelect v-model="searchForm.organParam" :multiple="true" :width="searchItemWidth" /> -->
      </el-form-item>
      <el-form-item label="数据分类" prop="category">
        <el-select v-model="searchForm.category" size="small" :style="searchItemWidth" placeholder="请选择分类">
          <el-option v-for="i in reviewCategoryDict" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="当前状态" prop="status">
        <el-select v-model="searchForm.status" size="small" :style="searchItemWidth" placeholder="请选择状态">
          <el-option v-for="i in reviewStatusDict" :key="i.value" :label="i.label" :value="i.value" />
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
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="单位" prop="organShortName" />
      <el-table-column align="center" label="提交人" width="120">
        <template slot-scope="scope">
          <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.CreatedAt | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="数据分类" align="center">
        <template slot-scope="scope">
          {{ getCategory(scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column label="当前状态" align="center">
        <template slot-scope="scope">
          <span :class="getStatusClass(scope.row.status)">{{ getStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="reviewerName" />

      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">审核</el-button>
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
    <ReviewDetail :visible="detailVisible" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'
import ReviewDetail from './ReviewDetail.vue'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'

import { reviewCategoryDict, reviewStatusDict } from '@/utils/dict'

export default {
  name: 'Review',
  components: { ReviewDetail, PersonnelOption },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin, search_mixin],
  data() {
    return {
      resource: 'review',
      queryMeans: 'backend',
      originData: [],
      currentData: [],
      reviewStatusDict,
      reviewCategoryDict,
      searchItemWidth: { width: '170px' },
      searchNameWidth: { width: '160px' },
      formItemWidth: { width: '170px' },
      searchForm: { personnelId: '', organParam: '', category: '', status: '' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
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
      params = this.buildParams(this.queryMeans, params)
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
    editSuccess() {
      this.detailVisible = false
      this.fetchData(this.searchData, this.queryParam)
    },
    getCategory(c) {
      for (const i of reviewCategoryDict) {
        if (i.value === c) {
          return i.label
        }
      }
      return '未定义'
    },
    getStatus(s) {
      for (const i of reviewStatusDict) {
        if (i.value === s) {
          return i.label
        }
      }
      return '未定义'
    },
    getStatusClass(s) {
      switch (s) {
        case -1:
          return 'status-danger'
        case 2:
          return 'status-success'
        default:
          return 'status-normal'
      }
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
.status-success {
  color: #009966;
}
.status-normal {
}
.status-danger {
  color: #FF6666;
}

</style>
