<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addVisible = true">添加</el-button>
      <el-button v-if="count" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="count" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否为领导职务">
        <template slot-scope="scope">
          {{ scope.row.isLeader ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性质">
        <template slot-scope="scope">
          {{ scope.row.isChief ? '正职' : '副职' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="级别">
        <template slot-scope="scope">
          {{ scope.row.levelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
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
    <position-add :visible="addVisible" :passed-data="levelList" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <position-update :visible="updateVisible" :passed-data="levelList" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { permission_mixin } from '@/common/mixin/permission'

import PositionAdd from './PositionAdd'
import PositionUpdate from './PositionUpdate'

export default {
  name: 'Position',
  components: { PositionAdd, PositionUpdate },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin],
  data() {
    return {
      resource: 'position',
      originData: [],
      currentData: [],
      levelList: []
    }
  },
  created() {
    this.fetchData()
    this.fetchLevelData()
  },
  methods: {
    fetchData() {
      request('position', 'list').then(response => {
        this.currentData = response.data
        this.listLoading = false
      })
    },
    fetchLevelData() {
      request('level', 'list').then(response => {
        this.levelList = response.data
        this.listLoading = false
      })
    },
    handleAllData() {
      this.currentPage = 1
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
</style>
