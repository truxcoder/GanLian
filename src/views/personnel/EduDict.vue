<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 15:09:42
 * @LastEditTime: 2022-03-03 14:15:49
 * @LastEditors: truxcoder
 * @Description: 学历字典
-->
<template>
  <div class="app-container">
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加</el-button>
      <el-button v-if="total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div class="tableZone">
      <el-table v-loading="listLoading" :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类">
          <template slot-scope="scope">
            {{ categoryMap.get(scope.row.category) }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
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
    <EduDictEdit :visible="editVisible" :action="action" :row="rowData" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { eduCategory } from '@/utils/dict'
import EduDictEdit from './EduDictEdit.vue'

export default {
  name: 'EduDict',
  components: { EduDictEdit },
  mixins: [common_mixin, delete_mixin, list_mixin],
  data() {
    return {
      resource: 'edu_dict',
      currentData: [],
      organMap: {}
    }
  },
  computed: {
    options() {
      return { category: eduCategory }
    },
    categoryMap() {
      const _map = new Map()
      eduCategory.forEach(item => _map.set(item.value, item.label))
      return _map
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      request('personnel', 'dict').then(response => {
        this.currentData = response.data
        this.listLoading = false
      })
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
.tableZone {
  width: 1200px;
}
</style>
