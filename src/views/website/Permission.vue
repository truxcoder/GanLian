<template>
  <div class="app-container user-container">
    <el-card class="left-card">
      <el-tree
        ref="tree"
        class="filter-tree"
        :data="moduleList"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        icon-class="no"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <i :class="data.icon" />
          <span>{{ node.label }}</span>
        </div>
      </el-tree>
    </el-card>
    <el-card class="right-card">
      <div class="user-tool-bar">
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">添加</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="originData"
        element-loading-text="Loading"
        :header-cell-style="{'background-color':'#f8f8f9','color':'#666'}"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="菜单标题" width="130">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签" width="130">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="级别" width="55">
          <template slot-scope="scope">
            {{ scope.row.rank | rankFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" width="120">
          <template slot-scope="scope">
            {{ scope.row.path }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="组件名">
          <template slot-scope="scope">
            {{ scope.row.component }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="重定向">
          <template slot-scope="scope">
            {{ scope.row.redirect }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="图标">
          <template slot-scope="scope">
            {{ scope.row.icon | iconFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="父组件" width="130">
          <template slot-scope="scope">
            {{ parentList[scope.row.parent] || '网站根模块' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="50">
          <template slot-scope="scope">
            {{ scope.row.order }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-link type="success" class="oper-btn" icon="el-icon-edit" :underline="false" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
            <el-link type="danger" class="oper-btn" icon="el-icon-delete" :underline="false" @click="handleDelete(scope.$index,scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <module-add :cpn-visible="addFormVisible" :module-list="originData" @addDataSuccess="addDataSuccess" @addVisibleChange="addVisibleChange" />
    <module-edit :cpn-visible="editFormVisible" :rowdata="rowData" :module-list="originData" @updateDataSuccess="updateDataSuccess" @visibleChange="editVisibleChange" />
  </div>
</template>

<script>
import { getModuleList, deleteModule } from '@/api/module'
import ModuleAdd from './ModuleAdd'
import ModuleEdit from './ModuleEdit'

import { transToTreeData } from '@/utils/module'

export default {
  name: 'Permission',
  components: { ModuleAdd, ModuleEdit },
  filters: {
    rankFilter(rank) {
      return { 1: '一级', 2: '二级' }[rank]
    },
    iconFilter(icon) {
      return icon.replace('el-icon-', '')
    }
  },
  data() {
    return {
      currentData: [],
      originData: [],
      listLoading: true,
      editFormVisible: false,
      addFormVisible: false,
      rowData: {},
      currentEditIndex: 0,
      rowSuccessClass: '',
      multipleSelection: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    parentList() {
      const tempObj = {}
      this.originData.forEach(item => tempObj[item.id] = item.title)
      return tempObj
    },
    moduleList() {
      return transToTreeData(this.originData)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterNode(value, data) {
    //   if (!value) return true
    //   return data.label.indexOf(value) !== -1
    },
    nodeClick(nodeobj) {
    //   if (nodeobj.parent === "0") {
    //     this.fetchData()
    //   } else if (nodeobj.label === "大队") {
    //     return
    //   } else {
    //     this.currentData = this.originData.filter(item => item.departmentId === nodeobj.id)
    //   }
    },
    fetchData(params = {}) {
      this.listLoading = true
      getModuleList(params).then(response => {
        this.originData = response.data
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.editFormVisible = true
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModule({ id: [id] }).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }).catch(err => {
          console.log(err)
          // this.$message.error(err.message)
        })
      }).catch(() => {
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
        deleteModule({ id: this.multipleSelection.map(item => item.id) }).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }).catch(err => {
          // this.$message.error(err.message)
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editVisibleChange() {
      this.editFormVisible = false
    },
    addVisibleChange() {
      this.addFormVisible = false
    },
    addDataSuccess() {
      this.addFormVisible = false
      this.fetchData()
    },
    updateDataSuccess(row) {
      this.editFormVisible = false
      this.fetchData()
    }
  }
}
</script>

<style>
/* @tailwind base;
@tailwind components;
@tailwind utilities; */
.user-container {
  display: flex;
}
.left-card {
  flex: 0 1 300px;
  margin-right: 10px;
}
.right-card {
  flex: 1;

}
.filter-tree {
  margin-top: 10px;
}
.oper-btn{
  font-size: 12px;
  margin: 0 5px;
}

.el-table--border, .el-table--group {
    border-color: #dedede;
}
.el-table--border:after, .el-table--group:after, .el-table:before {
    background-color: #dedede;
}
.el-table td, .el-table--border th,.el-table th.is-leaf {
    border-bottom-color: #dedede;
}
.el-table--border td, .el-table--border th {
    border-right-color: #dedede;
}

.pagination {
  margin-top: 15px;
}

.user-tool-bar {
  padding: 0 0 10px 0;
}
.custom-tree-node {

}
.custom-tree-node i { margin: 0 10px;}
</style>
