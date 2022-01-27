<template>
  <el-dialog v-loading="dialogLoading" title="维护处分项字典" width="900px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" :model="form" :rules="rules">
      <el-form-item label="处分名称" prop="name">
        <el-input v-model.trim="form.name" size="small" />
      </el-form-item>
      <el-form-item label="处分类型" prop="category">
        <el-select v-model="form.category" :style="formItemWidth" size="small" placeholder="请选择分类">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="影响期限" prop="term">
        <el-input v-model.number="form.term" class="number-input" type="number" style="width: 180px">
          <template slot="append">个月</template>
        </el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="onSubmit">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" element-loading-text="Loading" stripe border :fit="true" highlight-current-row>
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          <span v-if="currentEditIndex !== scope.$index">{{ scope.row.name }}</span>
          <el-input v-else v-model="updateForm.name" size="small" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span v-if="currentEditIndex !== scope.$index">{{ categoryMap.get(scope.row.category) }}</span>
          <el-select v-else v-model="updateForm.category" size="small" :style="formItemWidth" placeholder="请选择分类">
            <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="影响期" width="200">
        <template slot-scope="scope">
          <span v-if="currentEditIndex !== scope.$index">{{ scope.row.term }}个月</span>
          <el-input v-else v-model.number="updateForm.term" class="number-input" type="number" size="small">
            <template slot="append">个月</template>
          </el-input>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="currentEditIndex !== scope.$index" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="currentEditIndex === scope.$index" size="mini" type="primary" @click="onUpdateSubmit(scope.row)">确定</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          <el-button size="mini" type="primary" plain @click="resetUpdateForm">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" round plain size="small" @click="onCancel">关闭对话框</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { curd } from '@/api/index'
export default {
  name: 'DisDict',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      resource: 'dis_dict',
      form: { name: '', category: '' },
      currentData: [],
      originData: [],
      formItemWidth: { width: '220px' },
      updateForm: { name: '', category: '' },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        category: [{ required: true, message: '请选择类型', trigger: 'change' }]
        // term: [{ required: true, type: 'number', message: '请输入数字', trigger: 'change' }]
      },
      currentEditIndex: -1,
      rowSuccessClass: '',
      dialogLoading: false
    }
  },
  computed: {
    // currentData() {
    //   return this.list
    // }
    categoryMap() {
      const map = new Map()
      this.options.category.forEach(item => map.set(item.value, item.label))
      return map
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.currentData = this.list
      } else {
        this.currentData = []
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          curd('add', this.form, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$refs.addForm.resetFields()
              this.$emit('dictChange')
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
      let isValid = true
      Object.values(this.updateForm).forEach(item => {
        if (item === '') {
          this.$message.error('所有字段都不能为空')
          isValid = false
          return
        }
      })
      if (this.updateForm.name === row.name && this.updateForm.category === row.category) {
        this.$message.info('未更改任何数据')
        this.resetUpdateForm()
        isValid = false
      }
      if (!isValid) {
        return false
      }
      const data = { id: row.id, name: this.updateForm.name, category: this.updateForm.category }
      this.dialogLoading = true
      curd('update', data, { resource: this.resource })
        .then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.resetUpdateForm()
          this.$emit('dictChange')
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
      this.updateForm.category = row.category
      // this.updateForm.term = row.term
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          curd('delete', { id: [id] }, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$emit('dictChange')
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
      this.updateForm.category = ''
      // this.updateForm.term = ''
      this.currentEditIndex = -1
    },
    onCancel() {
      this.$emit('visibleChange', 'dict')
      this.resetUpdateForm()
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style scoped>
.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
