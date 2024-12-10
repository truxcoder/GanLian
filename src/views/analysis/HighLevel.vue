<!--
 * @Author: truxcoder
 * @Date: 2022-09-21 09:43:40
 * @LastEditTime: 2024-10-22 10:05:07
 * @LastEditors: truxcoder
 * @Description: 高级警长情况分析
-->
<template>
  <div v-if="can.special" class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="选择单位" prop="organ">
        <el-select v-model="searchForm.organ" size="small" :style="searchItemWidth" disabled placeholder="请选择单位">
          <el-option v-for="i in organs" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="截止日期" prop="date">
        <el-date-picker v-model="searchForm.date" :style="searchItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" icon="el-icon-refresh" @click="onSync">更新缓存</el-button>
      </el-form-item>
    </el-form>

    <div class="border border-slate-200 mb-4 p-2 text-red-600 bg-gray-50">本模块是基于缓存进行数据分析，请修改人员数据后及时更新缓存</div>

    <div class="tableZone">
      <el-table v-loading="listLoading" :data="queryMeans === 'backend' ? currentData : currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="人员">
          <template slot-scope="scope">
            <el-link :href="getDetailLink(scope.row.id)" target="_blank">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="四高日期">
          <template slot-scope="scope">
            {{ scope.row.g4StartDay | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="三高日期">
          <template slot-scope="scope">
            {{ scope.row.g3StartDay | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="二高日期">
          <template slot-scope="scope">
            {{ scope.row.g2StartDay | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="一高日期">
          <template slot-scope="scope">
            {{ scope.row.g1StartDay | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="退休日期">
          <template slot-scope="scope">
            <!-- {{ retireTime(scope.row) }} -->
            {{ scope.row.retireDay | dateFilter }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination v-if="total" class="pagination" background :current-page="currentPage" :page-sizes="[10, 20, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- <el-card class="mt-4">
      <div slot="header">
        <span class="font-bold">四级高级警长</span>
      </div>
      <div class="w-full">
        <span v-for="i in G4Data" :key="i.id" class="px-4">
          <el-link :underline="false">{{ i.name }}</el-link>
          <el-tag type="info" size="small" class="ml-2">{{ isRetire(i) }} {{ retireTime(i) }}</el-tag>
        </span>
      </div>
    </el-card>

    <el-card class="mt-4">
      <div slot="header">
        <span class="font-bold">三级高级警长</span>
      </div>
      <div class="w-full">
        <span v-for="i in G3Data" :key="i.id" class="px-4">
          <el-link :underline="false">{{ i.name }}</el-link>
        </span>
      </div>
    </el-card> -->
  </div>
</template>

<script>
import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'

import { isDate, isEmpty } from 'lodash/lang'
import { getAge } from '@/utils'
import dayjs from 'dayjs'

export default {
  name: 'HighLevel',
  mixins: [common_mixin, list_mixin, permission_mixin, search_mixin],
  data() {
    return {
      resource: 'analysis',
      queryMeans: 'frontend',
      G4Data: [],
      G3Data: [],
      G2Data: [],
      G1Data: [],
      currentData: {},
      currentOrgan: {},
      departments: [],
      searchForm: { organ: '3d7e73e3a3034ca1a1da707aa3d54a96', date: '' },
      searchItemWidth: { width: '160px' },
      currentSearchTime: '',
    }
  },
  computed: {
    organs() {
      return this.$store.getters.organs.filter((i) => i.shortName !== '攀枝花所' && i.shortName !== '泸州所')
    },
  },
  created() {
    this.check().then(() => {
      // const today = new Date('2024-02-02T12:00:00Z')
      const today = new Date()
      const data = { organ: '3d7e73e3a3034ca1a1da707aa3d54a96', date: today }
      this.currentSearchTime = dayjs(today).format('YYYY-MM-DD')
      this.fetchData(data)
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      console.log('[ data ] >', data)
      request(this.resource, 'high_level', data)
        .then((response) => {
          console.log('[ response ] >', response)
          // this.G4Data = response['g4']
          // this.G3Data = response['g3']
          // this.departments = response.department
          // this.currentData = JSON.parse(this.originData)
          // this.currentOrgan = this.organs[0]
          // if (!this.can.global && this.organs.map((i) => i.id).includes(this.$store.getters.organ)) {
          //   for (const i of this.organs) {
          //     if (i.id === this.$store.getters.organ) {
          //       this.currentOrgan = i
          //       break
          //     }
          //   }
          // }
          this.originData = response.data
          this.currentData = [...this.originData]

          this.listLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.listLoading = false
        })
    },
    onChangeOrgan(v) {
      this.currentOrgan = v
    },
    onSearch() {
      const searchData = {}
      let searchParamNumber = 0
      for (const key in this.searchForm) {
        // if (this.searchForm[key] !== '') {
        if (!isEmpty(this.searchForm[key]) || isDate(this.searchForm[key])) {
          if (Object.prototype.toString.call(this.searchForm[key]) === '[object String]' && (this.searchForm[key].includes("'") || this.searchForm[key].includes('or') || this.searchForm[key].includes('and') || this.searchForm[key].includes('--'))) {
            this.$message.error('查询参数包含非法字符!')
            return false
          }
          // 如果查询key不是organParam，则添加searchData中，否则往fetchData里传一个param，包含单位id, 以便buildParams接收。
          if (key !== 'organParam') {
            searchData[key] = this.searchForm[key]
          } else {
            this.queryParam = { organId: this.searchForm[key] }
          }
          searchParamNumber++
        } else if (key === 'organParam') {
          this.queryParam = {}
        }
      }
      if (!searchParamNumber) {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！',
        })
        return
      }
      this.searchData = searchData
      this.currentPage = 1
      this.currentSearchTime = dayjs(this.searchData.date).format('YYYY-MM-DD')
      this.fetchData(searchData, this.queryParam)
      this.onClean()
    },
    onSync() {
      const today = new Date()
      const data = { organ: '3d7e73e3a3034ca1a1da707aa3d54a96', date: today }
      this.listLoading = true
      request(this.resource, 'sync')
        .then((response) => {
          this.$message.success(response.message)
          this.fetchData(data)
        })
        .catch((err) => {
          this.$message.error(err.message)
          this.listLoading = false
        })
    },
    // 清空搜索框
    onClean() {
      this.$refs.searchForm.resetFields()
      this.searchForm.organ = '3d7e73e3a3034ca1a1da707aa3d54a96'
      // this.queryParam = {}
    },
    retireTime(p) {
      return p.gender === '男' ? dayjs(p.birthday).add(60, 'year').format('YYYY-MM-DD') : dayjs(p.birthday).add(55, 'year').format('YYYY-MM-DD')
    },
    // 判断是否退休
    isRetire(p) {
      return dayjs(this.currentSearchTime).isAfter(this.retireTime(p))
    },
    howOld(p) {
      return getAge(p.birthday)
    },
  },
}
</script>

<style scoped></style>
