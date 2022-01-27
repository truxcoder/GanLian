<!--
 * @Author: truxcoder
 * @Date: 2022-01-19 15:22:52
 * @LastEditTime: 2022-01-19 16:14:00
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div>
    <el-table :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row>
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          {{ scope.row.idCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出生日期">
        <template slot-scope="scope">
          {{ scope.row.birthday | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属单位">
        <template slot-scope="scope">
          {{ getOrganName(scope.row.organID) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          {{ getDepartmentName(scope.row.deptId) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型">
        <template slot-scope="scope">
          {{ scope.row.userType | userTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total"
      class="pagination"
      background
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'

export default {
  name: 'Data',
  filters: {
    userTypeFilter(userType) {
      if (userType === 1) {
        return '民警'
      }
      if (userType === 2) {
        return '辅警'
      }
      return '未定义'
    }
  },
  mixins: [common_mixin],
  props: {
    passed: {
      type: Array,
      default() {
        return {}
      }
    },
    organMap: {
      type: Object,
      default() {
        return {}
      }
    },
    departmentMap: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    currentPageData() {
      return this.passed.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    total() {
      return this.passed.length
    }
  },
  methods: {
    currentChange(currentPage) {
      this.currentPage = currentPage
    },
    getOrganName(id) {
      return id ? this.organMap[id]?.shortName : '未定义'
    },
    getDepartmentName(id) {
      return id ? this.departmentMap[id]?.shortName : '未定义'
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
