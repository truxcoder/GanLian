<template>
  <div class="app-container">
    <!-- <el-row v-if="!total">
      <el-col :span="24"><h2>暂无数据</h2></el-col>
    </el-row> -->
    <el-form ref="addForm" :inline="true" :model="form" :rules="rules">
      <el-form-item label="名称(英文)" prop="name">
        <el-input v-model="form.name" size="small" />
      </el-form-item>
      <el-form-item label="标签(中文)" prop="title">
        <el-input v-model="form.title" size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="onSubmit">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="currentData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row>
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          <span v-if="currentEditIndex !== scope.$index">{{ scope.row.name }}</span>
          <el-input v-else v-model="updateForm.name" size="small" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span v-if="currentEditIndex !== scope.$index">{{ scope.row.title }}</span>
          <el-input v-else v-model="updateForm.title" size="small" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="currentEditIndex !== scope.$index" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="currentEditIndex === scope.$index" size="mini" type="primary" @click="onUpdateSubmit(scope.row)">确定</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="handlePermission(scope.row.name)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <permission-set :visible="visible" :role="role" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { roleDictAdd, roleDictUpdate, roleDictDelete } from '@/api/role'
import PermissionSet from './PermissionSet.vue'

export default {
  name: 'RoleDict',
  components: { PermissionSet },
  data() {
    return {
      form: { name: '', title: '' },
      updateForm: { name: '', title: '' },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        title: [{ required: true, message: '请输入标签', trigger: 'change' }]
      },
      currentEditIndex: -1,
      rowSuccessClass: '',
      dialogLoading: false,
      visible: false,
      role: ''
    }
  },
  computed: {
    currentData() {
      return [...this.$store.getters.roleDict]
    }
  },
  created() {
    if (this.$store.getters.roleDict.length === 0) {
      this.$store.dispatch('role/setRoleDict')
    }
  },
  methods: {
    visibleChange() {
      this.visible = false
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.currentData.map(i => i.name).includes(this.form.name)) {
            this.$message.error('有重复的角色名')
            return false
          }
          this.dialogLoading = true
          roleDictAdd(this.form)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$store.dispatch('role/setRoleDict')
              this.dialogLoading = false
              this.$refs.addForm.resetFields()
            })
            .catch(err => {
              console.log(err)
              this.dialogLoading = false
            })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    onUpdateSubmit(row) {
      if (this.updateForm.name === '' || this.updateForm.title === '') {
        this.$message.error('所有字段都不能为空')
        return false
      }
      if (this.currentData.map(i => i.name).includes(this.updateForm.name) && this.updateForm.name !== row.name) {
        this.$message.error('有重复的角色名')
        return false
      }
      if (this.updateForm.name === row.name && this.updateForm.title === row.title) {
        this.$message.info('未更改任何数据')
        this.resetUpdateForm()
        return false
      }
      const data = { id: row.id, name: this.updateForm.name, title: this.updateForm.title }
      this.dialogLoading = true
      roleDictUpdate(data)
        .then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.$store.dispatch('role/setRoleDict')
          this.resetUpdateForm()
          this.dialogLoading = false
        })
        .catch(err => {
          console.log(err)
          this.resetUpdateForm()
          this.dialogLoading = false
        })
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      if (this.currentEditIndex !== -1) {
        this.$message.error('一次只能编辑一条信息！')
        return
      }
      this.currentEditIndex = index
      this.updateForm.name = row.name
      this.updateForm.title = row.title
    },
    handlePermission(role) {
      this.role = role
      this.visible = true
    },
    handleDelete(index, row) {
      console.log('row:', row)
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          roleDictDelete(row)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$store.dispatch('role/setRoleDict')
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
    resetUpdateForm() {
      this.updateForm.name = ''
      this.updateForm.title = ''
      this.currentEditIndex = -1
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
