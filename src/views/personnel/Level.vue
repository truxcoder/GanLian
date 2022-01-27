<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 15:09:42
 * @LastEditTime: 2022-01-11 09:22:39
 * @LastEditors: truxcoder
 * @Description: 职务等级
-->
<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addVisible = true">添加</el-button>
      <el-button v-if="total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="total" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <div class="tableZone">
      <el-table v-loading="listLoading" :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.order }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
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
    <level-add :visible="addVisible" :passed-data="currentData" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <level-update :visible="updateVisible" :passed-data="currentData" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'

import LevelAdd from './LevelAdd'
import LevelUpdate from './LevelUpdate'

export default {
  name: 'Level',
  components: { LevelAdd, LevelUpdate },
  mixins: [common_mixin, delete_mixin, list_mixin],
  data() {
    return {
      resource: 'level',
      currentData: [],
      organMap: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      request('level', 'list').then(response => {
        this.currentData = response.data
        this.listLoading = false
      })
    },
    handleAllData() {
      this.fetchData()
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
  width: 600px;
}
</style>
