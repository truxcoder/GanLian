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
      <div class="tool-bar">
        <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleAdd">为角色授权</el-button>
        <el-button v-if="can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除角色权限</el-button>
        <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
        <el-button v-if="can.manage" type="primary" icon="el-icon-document" size="mini" @click="dictVisible = true">维护角色字典</el-button>
      </div>
      <el-table v-loading="listLoading" :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" width="100" label="模块">
          <template slot-scope="scope">
            {{ scope.row.moduleTitle }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色" width="100">
          <template slot-scope="scope">
            {{ scope.row.roleTitle }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ showPermission(scope.row.permissionName) }}
            <!-- {{ scope.row.permissionName }} -->
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      <permission-manage :visible="manageVisible" :options="options" :passed="rowData" :is-update="isUpdate" @manageSuccess="manageSuccess" @manageVisibleChange="manageVisibleChange" />
      <!-- <permission-update :form-visible="updateFormVisible" :options="roleOption" :rowdata="rowData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
      <permission-dict :visible="dictVisible" @dictVisibleChange="dictVisibleChange" /> -->
    </el-card>
  </div>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import { permission_mixin } from '@/common/mixin/permission'
import { permissionList, permissionDelete } from '@/api/permission'
import { getModuleList } from '@/api/module'
import PermissionManage from './PermissionManage.vue'
// import PermissionUpdate from './PermissionUpdate.vue'
// import PermissionDict from './PermissionDict.vue'

import { transToTreeData } from '@/utils/module'
import { arrayPermute } from '@/utils/permission'

export default {
  name: 'Permission',
  components: { PermissionManage },
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      permissionData: [],
      moduleData: [],
      listLoading: true,
      manageVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      currentEditIndex: 0,
      multipleSelection: [],
      rowSuccessClass: '',
      currentPage: 1,
      pageSize: 10,
      isUpdate: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    count() {
      return this.parsedData.length
    },
    moduleList() {
      return transToTreeData(this.moduleData)
    },
    permissionMap() {
      return {
        ADD: '添加数据',
        DELETE: '删除数据',
        UPDATE: '修改数据',
        READ: '查看数据',
        MANAGE: '管理数据',
        MENU: '进入菜单'
      }
    },
    /**
     * @description: 处理原始数据。把后台返回的[{sub, obj, act}]列表转换成[{sub, obj, act1act2act3}],即把acts用,连接成字符串
     * @param {*}
     * @return {*}
     */
    parsedData() {
      const temp = new Map()
      this.permissionData.forEach(item => {
        const item_ = { ...item }
        const key = item_.moduleName + item_.roleName
        if (!temp.has(key)) {
          temp.set(key, item_)
        } else {
          temp.get(key).permissionName = temp.get(key).permissionName + ',' + item_.permissionName
        }
      })
      const result = []
      for (const item of temp.values()) {
        result.push(item)
      }
      return result
    },
    options() {
      const module = this.moduleData.map(item => {
        return { label: item.title, value: item.name, rank: item.rank }
      })
      const role = this.$store.getters.roleDict.map(item => {
        return { label: item.title, value: item.name }
      })
      const permission = []
      for (const k in this.permissionMap) {
        permission.push({ label: this.permissionMap[k], value: k })
      }
      return { module, role, permission }
    },
    currentPageData() {
      return this.parsedData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  created() {
    if (this.$store.getters.roleDict.length === 0) {
      this.$store.dispatch('role/setRoleDict')
    }
    this.fetchAllData()
  },
  methods: {
    fetchAllData(params = {}) {
      this.listLoading = true
      const promises = [permissionList({}), getModuleList()]
      Promise.all(promises).then(responses => {
        this.permissionData = responses[0].data || []
        this.moduleData = responses[1].data
        this.listLoading = false
      })
    },
    fetchData(params = {}) {
      this.listLoading = true
      permissionList(params).then(response => {
        this.permissionData = response.data || []
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAllData() {
      this.fetchData()
    },
    handleAdd() {
      // console.log(index, row)
      this.rowData = {}
      this.isUpdate = false
      this.manageVisible = true
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.isUpdate = true
      this.manageVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('将删除该组权限, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const temp = [[row.roleName], [row.moduleName], row.permissionName.split(',')]
          const data = arrayPermute(temp)

          permissionDelete(data)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.fetchData()
            })
            .catch(err => {
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
      this.$confirm('将删除选中权限, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let temp = []
          let data = []
          this.multipleSelection.forEach(item => {
            temp = [[item.roleName], [item.moduleName], item.permissionName.split(',')]
            data = data.concat(arrayPermute(temp))
          })
          console.log('data:', data)
          permissionDelete(data)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.fetchData()
            })
            .catch(err => {
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

    manageVisibleChange() {
      this.manageVisible = false
      this.rowData = {}
    },
    dictVisibleChange() {
      this.dictVisible = false
    },
    manageSuccess() {
      this.manageVisible = false
      this.rowData = {}
      this.check()
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    showPermission(name) {
      const result = name.split(',').map(item => this.permissionMap[item])
      return result.join('，')
    }
  }
}
</script>

<style scoped>
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
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
</style>
