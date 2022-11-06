<!--
 * @Author: truxcoder
 * @Date: 2022-02-09 10:59:14
 * @LastEditTime: 2022-09-20 10:18:14
 * @LastEditors: truxcoder
 * @Description: 人员详情页个人培训模块编辑参与培训信息，本页列出培训列表供用户选择或取消参与
-->

<template>
  <el-dialog v-loading="dialogLoading" :title="row.title" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class=" w-full">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="培训标题" prop="title">
          <el-input v-model="searchForm.title" size="small" :style="formTitleWidth" placeholder="培训标题" />
        </el-form-item>
        <el-form-item label="主办单位" prop="sponsor">
          <el-select v-model="searchForm.sponsor" size="small" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
            <el-option v-for="i in organOption" :key="i.id" :label="i.name" :value="i.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="onClean">清空</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row>
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="培训标题" :show-overflow-tooltip="true" prop="title" />
        <el-table-column label="开始时间" align="center" width="160">
          <template slot-scope="scope">
            {{ scope.row.startTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.endTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="主办单位" align="center" width="240" show-overflow-tooltip prop="sponsor" />
        <el-table-column label="培训学时" align="center" width="80">
          <template slot-scope="scope"> {{ scope.row.period }}学时 </template>
        </el-table-column>
        <el-table-column align="center" label="是否参加" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" class=" mr-1" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch($event, scope.$index, scope.row)" />
            <!-- <span v-if="isSelected(scope.row.id)" class=" text-green-500">已参加</span>
            <span v-if="!isSelected(scope.row.id)" class=" text-red-500">未参加</span> -->
            <!-- <el-tag v-if="isSelected(scope.row.id)" size="small" type="success">已参加</el-tag>
            <el-tag v-if="!isSelected(scope.row.id)" size="small" type="danger">未参加</el-tag> -->
            <!-- <el-button v-if="!isSelected(scope.row.id)" size="mini" type="success" @click="handleAdd(scope.row)">
              参加
            </el-button>
            <el-button v-if="isSelected(scope.row.id)" size="mini" type="info" disabled>
              已参加
            </el-button> -->
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
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { search_mixin } from '@/common/mixin/search'
import { list_mixin } from '@/common/mixin/list'

// const array = require('lodash/array')
const _ = require('lodash')

export default {
  name: 'TrainPersonAdd',
  mixins: [common_mixin, list_mixin, search_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    passed: {
      type: Array,
      default() {
        return []
      }
    },
    can: {
      type: Object,
      default() {
        return {}
      }
    },
    personnelId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      resource: 'person_train',
      queryMeans: 'backend',
      originData: [], // 原始所有培训列表
      currentData: [], // 当前培训列表
      selectData: [], // 已选择的培训id数组
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '250px' },
      formTitleWidth: { width: '500px' },
      formTextAreaWidth: { width: '940px' },
      dialogLoading: false,
      searchForm: { title: '', sponsor: '' }
    }
  },
  computed: {
    orginSelected() {
      return this.passed.map(item => item.id)
    },
    organOption() {
      return this.$store.getters.organs
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.selectData = this.passed.map(item => item.id)
        this.fetchData()
      } else {
        this.searchData = {}
        this.currentPage = 1
        this.originData = []
        this.currentData = []
        this.selectData = []
        this.onClean()
        this.dialogLoading = false
      }
    }
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      if (!this.can.global) {
        params.organId = this.$store.getters.organ
      }
      params = this.buildParams(this.queryMeans, params)
      request('training', 'list', data, params).then(response => {
        this.originData = response.data ?? []
        this.count = response.count
        if (this.originData.length) {
          this.originData.forEach(item => {
            item.status = this.isSelected(item.id)
          })
        }
        this.currentData = this.originData.length ? [...this.originData] : []
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    onSubmit() {
      // if (this.selectData.length === 0) {
      //   this.$message.warning('不能提交空数据')
      //   return false
      // }
      this.dialogLoading = true
      const added = _.difference(this.selectData, this.orginSelected)
      const deled = _.difference(this.orginSelected, this.selectData)
      if (added.length === 0 && deled.length === 0) {
        this.$message.warning('未修改任何数据')
        this.dialogLoading = false
        return false
      }
      if (added.length > 0 && deled.length > 0) {
        const addData = added.map(item => {
          return { personnelId: this.personnelId, trainId: item }
        })
        Promise.all([request('training', 'add', addData), request('training', 'delete', { personnelId: this.personnelId, trainId: deled })]).then(response => {
          this.$message.success(response[0].message + ' ' + response[1].message)
          this.dialogLoading = false
          this.$emit('addSuccess')
        })
      } else if (added.length > 0) {
        const addData = added.map(item => {
          return { personnelId: this.personnelId, trainId: item }
        })
        request('training', 'add', addData).then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('addSuccess')
        })
      } else if (deled.length > 0) {
        request('training', 'delete', { personnelId: this.personnelId, trainId: deled }).then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('addSuccess')
        })
      } else {
        this.$message.warning('有错误发生!')
        this.dialogLoading = false
        return false
      }
    },
    handleAdd(id) {
      if (this.isSelected(id)) {
        const index = this.selectData.indexOf(id)
        this.selectData.splice(index, 1)
      } else {
        this.selectData.push(id)
      }
    },
    changeSwitch($event, index, row) {
      const temp = { ...row }
      temp.status = $event
      this.$set(this.currentData, index, temp)
      this.handleAdd(row.id)
      row.status = $event
    },
    onCancel() {
      this.$emit('visibleChange', 'add')
    },
    isSelected(id) {
      return this.selectData.includes(id)
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
