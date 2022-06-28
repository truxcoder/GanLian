<!--
 * @Author: truxcoder
 * @Date: 2021-12-22 10:10:06
 * @LastEditTime: 2022-05-26 19:00:24
 * @LastEditors: truxcoder
 * @Description: 抽取详情页
-->
<template>
  <el-dialog :title="row.title" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div id="dis-container">
      <el-table
        v-loading="listLoading"
        :data="currentPageData"
        element-loading-text="Loading"
        stripe
        border
        :fit="true"
        highlight-current-row
      >
        <el-table-column align="center" label="单位" prop="organShortName" width="100" />
        <el-table-column align="center" label="姓名" width="100">
          <template slot-scope="scope">
            <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别" prop="gender" width="55" />
        <el-table-column align="center" label="警号/工号" prop="policeCode" width="100" />
        <el-table-column label="年龄" width="55" align="center">
          <template slot-scope="scope">
            {{ scope.row.birthday | ageFilter }}
          </template>
        </el-table-column>
        <el-table-column label="取得考官证时间" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.beExaminerDay | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="岗位标签">
          <template slot-scope="scope">
            {{ scope.row.skill | skillFilter }}
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
      <el-button @click="onClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { list_mixin } from '@/common/mixin/list'
import { isEmpty } from 'lodash/lang'
export default {
  name: 'TalentPickDetail',
  filters: {
    skillFilter(v) {
      if (!isEmpty(v)) {
        return JSON.parse(v).toLocaleString()
      }
      return '无'
    }
  },
  mixins: [common_mixin, list_mixin],
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
    }
  },
  data() {
    return {
      queryMeans: 'frontEnd',
      originData: [],
      currentData: [],
      dialogWidth: '1200px'
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      request('talent', 'detail_list', { res: this.row.res }).then(response => {
        this.originData = response.data ?? []
        this.currentData = this.originData.length ? [...this.originData] : []
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    onClose() {
      this.$emit('visibleChange', 'detail')
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
