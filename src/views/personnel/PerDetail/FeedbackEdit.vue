<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-05-24 09:43:03
 * @LastEditors: truxcoder
 * @Description: 信息反馈
-->
<template>
  <el-dialog v-loading="dialogLoading" title="个人信息反馈" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form
      v-if="visible"
      ref="editForm"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
      <el-form-item label="姓名" prop="name">
        <el-input disabled :value="row.name" :style="formLineWidth" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model.trim="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" :style="formLineWidth" />
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
  name: 'FeedbackEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'feedback',
      formLabelWidth: '100px',
      form: { content: '' },
      rules: {
        content: [{ required: true, message: '请输入内容', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        // TODO:
        this.form = { personnelId: this.row.id, organId: this.$store.getters.organ, category: 1, content: '' }
      } else {
        this.form = { content: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          curd('add', this.form, { resource: this.resource })
            .then(response => {
              this.$message.success(response.message)
              this.dialogLoading = false
              this.$emit('editSuccess', 'feedback')
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
    onCancel() {
      this.$emit('visibleChange', 'feedback')
    }
  }
}
</script>

<style></style>
