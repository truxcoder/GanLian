<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <div class="tool-bar">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">添加</el-button>
      <el-button v-if="count" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="count" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="currentData"
      element-loading-text="Loading"
      stripe
      border
      :fit="true"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="名称" fixed>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="简称" fixed>
        <template slot-scope="scope">
          {{ scope.row.shortName }}
        </template>
      </el-table-column>
      <el-table-column label="上级单位" align="center">
        <template slot-scope="scope">
          {{ organMap[scope.row.parent] | getOrganName }}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.order }}
        </template>
      </el-table-column>
      <el-table-column label="编制数" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.authorizedSize }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleUpdate(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index,scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="count"
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <organ-add :form-visible="addFormVisible" :passed-data="currentData" @addSuccess="addSuccess" @addVisibleChange="addVisibleChange" />
    <organ-update :form-visible="updateFormVisible" :passed-data="currentData" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />

  </div>

</template>

<script>
import { getOrganList, organDelete } from '@/api/organ'
import { common_mixin } from '@/common/mixin/mixin'

import OrganAdd from './OrganAdd'
import OrganUpdate from './OrganUpdate'

export default {
  name: 'Organ',
  components: { OrganAdd, OrganUpdate },
  filters: {
    getOrganName(organ) {
      // return organ["name"]
      if (typeof organ === 'undefined') {
        return '司法厅'
      } else return organ['name']
    }
  },
  mixins: [common_mixin],
  data() {
    return {
      currentData: [],
      organMap: {},
      listLoading: true,
      updateFormVisible: false,
      addFormVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      currentEditIndex: 0,
      multipleSelection: [],
      rowSuccessClass: '',
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    count() {
      return this.currentData.length
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getOrganList({}).then(response => {
        this.currentData = response.data
        this.getOrganMap()
        this.listLoading = false
      })
    },
    getOrganMap() {
      for (const i of this.currentData) {
        this.organMap[i.id] = i
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleAllData() {
      this.fetchData()
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.updateFormVisible = true
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('id:', [id])
          organDelete({ id: [id] }).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.currentData.splice(index, 1)
          }).catch(err => {
          // this.$message.error(err.message)
            console.log(err)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteMutiData() {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organDelete({ id: this.multipleSelection.map(item => item.id) }).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }).catch(err => {
          // this.$message.error(err.message)
          console.log()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    addVisibleChange() {
      this.addFormVisible = false
    },
    updateVisibleChange() {
      this.updateFormVisible = false
    },
    addSuccess() {
      this.addFormVisible = false
      this.fetchData()
    },
    updateSuccess(row) {
      this.updateFormVisible = false
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      if (this.queryMeans === 'backend') {
        this.fetchData()
      }
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
