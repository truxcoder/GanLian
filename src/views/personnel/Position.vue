<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="form" :inline="true" :model="form">
      <el-form-item label="级别" prop="levelId">
        <el-select v-model="form.levelId" size="small" placeholder="职务级别">
          <el-option v-for="i in levelList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="性质" prop="isLeader">
        <el-select v-model="form.isLeader" size="small" placeholder="领导/非领导">
          <el-option label="领导职务" :value="2" />
          <el-option label="非领导职务" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="正副" prop="isChief">
        <el-select v-model="form.isChief" size="small" placeholder="正职/副职">
          <el-option label="正职" :value="2" />
          <el-option label="副职" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onFilter">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加</el-button>
      <el-button v-if="total" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
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
          {{ scope.row.isLeader === 2 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性质">
        <template slot-scope="scope">
          {{ scope.row.isChief === 2 ? '正职' : '副职' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="级别">
        <template slot-scope="scope">
          {{ scope.row.levelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
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
    <PositionEdit :visible="editVisible" :levels="levelList" :action="action" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { permission_mixin } from '@/common/mixin/permission'
import PositionEdit from './PositionEdit.vue'

export default {
  name: 'Position',
  components: { PositionEdit },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin],
  data() {
    return {
      resource: 'position',
      originData: [],
      currentData: [],
      levelList: [],
      form: { levelId: '', isLeader: '', isChief: '' }
    }
  },
  created() {
    this.fetchData()
    this.fetchLevelData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      request('position', 'list').then(response => {
        this.originData = response.data
        this.currentData = response.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    fetchLevelData() {
      request('level', 'list').then(response => {
        this.levelList = response.data
        this.listLoading = false
      })
    },
    onFilter() {
      let result = this.originData
      for (const key in this.form) {
        if (this.form[key] !== '') {
          result = result.filter(i => i[key] === this.form[key])
        }
      }
      this.currentData = result
    },
    handleAllData() {
      this.currentData = this.originData
      this.onClean()
      this.currentPage = 1
    },
    onClean() {
      this.$refs.form.resetFields()
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
