<template>
  <div class="app-container user-container">
    <el-card class="left-card">
      <el-tree ref="tree" class="filter-tree" :data="moduleList" :props="defaultProps" default-expand-all :expand-on-click-node="false" icon-class="no">
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <i :class="data.icon" />
          <span>{{ node.label }}</span>
        </div>
      </el-tree>
    </el-card>
    <el-card class="right-card">
      <div class="user-tool-bar">
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="orderVisible = true">更新模块排序</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="currentPageData"
        element-loading-text="Loading"
        :header-cell-style="{ 'background-color': '#f8f8f9', color: '#666' }"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column align="center" label="菜单标题" width="100">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签" width="110">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="级别" width="55">
          <template slot-scope="scope">
            {{ scope.row.rank | rankFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" width="110">
          <template slot-scope="scope">
            {{ scope.row.path }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="组件名" width="110">
          <template slot-scope="scope">
            {{ scope.row.component }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="重定向" width="110" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.redirect }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="图标" width="110" :show-overflow-tooltip="true">
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
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-link type="success" class="oper-btn" icon="el-icon-edit" :underline="false" @click="handleEdit('update', scope.row)">编辑</el-link>
            <el-link type="danger" class="oper-btn" icon="el-icon-delete" :underline="false" @click="handleDelete(scope.$index, scope.row.id)">删除</el-link>
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
    </el-card>
    <ModuleEdit :visible="editVisible" :action="action" :module-list="originData" :row="rowData" @editSuccess="editSuccess" @visibleChange="visibleChange" />

    <!-- <module-add :visible="addVisible" :module-list="originData" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <module-update :visible="updateVisible" :rowdata="rowData" :module-list="originData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" /> -->
    <module-order :visible="orderVisible" :module-list="orderCpnData" @visibleChange="visibleChange" @updateOrderSuccess="updateOrderSuccess" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { permission_mixin } from '@/common/mixin/permission'
import ModuleEdit from './ModuleEdit.vue'
// import ModuleAdd from './ModuleAdd.vue'
// import ModuleUpdate from './ModuleUpdate.vue'
import ModuleOrder from './ModuleOrder.vue'

import { transToTreeData } from '@/utils/module'

export default {
  name: 'Module',
  components: { ModuleEdit, ModuleOrder },
  filters: {
    rankFilter(rank) {
      return { 1: '一级', 2: '二级' }[rank]
    },
    iconFilter(icon) {
      return icon.replace('el-icon-', '')
    }
  },
  mixins: [common_mixin, permission_mixin, delete_mixin, list_mixin],
  data() {
    return {
      resource: 'module',
      currentData: [],
      originData: [],
      orderVisible: false,
      orderCpnData: [],
      rowSuccessClass: '',
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
      this.originData.forEach(item => (tempObj[item.id] = item.title))
      return tempObj
    },
    moduleList() {
      return transToTreeData(this.originData)
    },
    total() {
      return this.originData.length
    },
    currentPageData() {
      return this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
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
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      request('module', 'list').then(response => {
        this.originData = response.data
        this.currentData = response.data
        this.orderCpnData = this.originData.map(item => {
          return { id: item.id, name: item.name, title: item.title, order: item.order }
        })
        this.listLoading = false
      })
    },
    onOrderCancel() {
      this.orderVisibleChange()
      this.orderCpnData = this.originData.map(item => {
        return { id: item.id, title: item.title, order: item.order }
      })
    },
    updateOrderSuccess() {
      this.orderVisible = false
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
  flex: 0 1 200px;
  margin-right: 10px;
}
.right-card {
  flex: 1;
}
.filter-tree {
  margin-top: 10px;
}
.oper-btn {
  font-size: 12px;
  margin: 0 5px;
}

.el-table--border,
.el-table--group {
  border-color: #dedede;
}
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #dedede;
}
.el-table td,
.el-table--border th,
.el-table th.is-leaf {
  border-bottom-color: #dedede;
}
.el-table--border td,
.el-table--border th {
  border-right-color: #dedede;
}

.pagination {
  margin-top: 15px;
}

.user-tool-bar {
  padding: 0 0 10px 0;
}
.custom-tree-node i {
  margin: 0 10px;
}
</style>
