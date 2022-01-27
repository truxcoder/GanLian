<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addVisible = true">添加用户角色</el-button>
      <el-button v-if="can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除用户角色</el-button>
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
      <el-button v-if="can.manage" type="primary" icon="el-icon-document" size="mini" @click="dictVisible = true">维护角色字典</el-button>
    </div>
    <el-table v-loading="listLoading" :data="currentPageData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="警号/工号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.policeCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="角色" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ roleMap[scope.row.role] }}
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center">
        <template slot-scope="scope">
          <span>{{ organMap[scope.row.organId] && organMap[scope.row.organId].name }}</span>
          <!-- <span :class="{'text_red':!scope.row.organId}">{{ scope.row.organId ? getOrganName(scope.row.organId, "short") : '未定义' }}</span> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <role-add :visible="addVisible" :options="roleOption" @addSuccess="addSuccess" @visibleChange="visibleChange" />
    <role-update :visible="updateVisible" :options="roleOption" :rowdata="rowData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" />
    <role-dict :visible="dictVisible" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { list_mixin } from '@/common/mixin/list'
import { permission_mixin } from '@/common/mixin/permission'
import RoleAdd from './RoleAdd.vue'
import RoleUpdate from './RoleUpdate.vue'
import RoleDict from './RoleDict.vue'

export default {
  name: 'Role',
  components: { RoleAdd, RoleUpdate, RoleDict },
  mixins: [common_mixin, permission_mixin, list_mixin],
  data() {
    return {
      resource: 'role',
      queryMeans: 'frondEnd',
      originData: [],
      currentData: [],
      dictVisible: false,
      multipleSelection: []
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    organMap() {
      const map = {}
      this.organList.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    roleMap() {
      const map = {}
      this.$store.getters.roleDict.forEach(item => (map[item.name] = item.title))
      return map
    },
    roleOption() {
      const list = []
      for (const k in this.roleMap) {
        list.push({ label: this.roleMap[k], value: k })
      }
      return list
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    if (this.$store.getters.roleDict.length === 0) {
      this.$store.dispatch('role/setRoleDict')
    }
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}) {
      this.listLoading = true
      request(this.resource, 'list', data).then(response => {
        this.currentData = response.data || []
        this.listLoading = false
      })
    },
    handleAllData() {
      this.currentPage = 1
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(index, row) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request(this.resource, 'delete', [{ id: row.id, role: row.role }])
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
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = []
          this.multipleSelection.forEach(item => data.push({ id: item.id, role: item.role }))
          request(this.resource, 'delete', data)
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
