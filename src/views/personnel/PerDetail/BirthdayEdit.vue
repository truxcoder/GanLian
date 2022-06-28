<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-06-20 11:11:21
 * @LastEditors: truxcoder
 * @Description: 修改生日
-->
<template>
  <el-dialog v-loading="dialogLoading" title="修改生日" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="生日" prop="birthday">
        <el-date-picker v-model="form.birthday" :style="formLineWidth" placeholder="选择日期" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
export default {
  name: 'BirthdayEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'personnel',
      formLabelWidth: '100px',
      form: {},
      rules: {
        birthday: [{ required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form = { id: this.row.id, birthday: '' }
      } else {
        this.form = {}
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$confirm('修改人员生日是一个危险操作，请确保你有相关授权。该项操作将会记录在系统重要操作日志中。确定提交?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs.editForm.validate(valid => {
            if (valid) {
              this.dialogLoading = true
              request('personnel', 'update_birthday', this.form)
                .then(response => {
                  this.$message.success(response.message)
                  this.dialogLoading = false
                  this.$emit('editSuccess', 'updateBirthday')
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
        })
        .catch(() => {
          this.$message.info('已取消提交')
        })
    },
    onCancel() {
      this.$emit('visibleChange', 'updateBirthday')
    }
  }
}
</script>

<style></style>
