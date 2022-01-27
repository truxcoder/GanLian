<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 15:15:45
 * @LastEditTime: 2022-01-10 18:26:32
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <el-dialog v-loading="dialogLoading" title="添加级别信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :style="formItemWidth" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model.number="form.order" :style="formItemWidth" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { curd } from '@/api/index'
export default {
  name: 'LevelAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    passedData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      resource: 'level',
      form: { name: '', order: 0 },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
        ]
      },
      dialogLoading: false
    }
  },
  methods: {
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          console.log('this.form:', this.form)
          // levelAdd(this.form)
          curd('add', this.form, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('addSuccess')
              this.$refs.addForm.resetFields()
              // Object.keys(this.form).forEach(key => this.form[key]='')
            })
            .catch(err => {
              // this.$message.error(err.message)
              console.log(err)
              this.dialogLoading = false
            })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    onCancel() {
      this.$emit('visibleChange', 'add')
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style></style>
