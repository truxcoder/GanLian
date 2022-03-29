<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-16 18:44:44
 * @LastEditors: truxcoder
 * @Description: 职务级别添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '级别信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form
      v-if="visible"
      ref="editForm"
      :inline="true"
      class="add-form"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
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
import { edit_mixin } from '@/common/mixin/edit'
export default {
  name: 'LevelEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'level',
      form: { name: '', order: 0 },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form = { ...this.row }
      } else {
        this.form = { name: '', order: 0 }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          curd(this.action, this.form, { resource: this.resource })
            .then(response => {
              this.$message.success(response.message)
              this.dialogLoading = false
              this.$emit('editSuccess')
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
    }
  }
}
</script>

<style></style>
