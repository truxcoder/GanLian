<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-06-22 11:26:48
 * @LastEditors: truxcoder
 * @Description: 任免登记
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '任免信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formLineWidth" :value="singlePersonnelData.name" disabled />
        <PersonnelOption v-if="!isSingle" v-model="form.personnelId" :rowdata="row" :is-update="action === 'update'" :form-item-width="formLineWidth" />
      </el-form-item>
      <el-form-item label="拟任职务" prop="appointPost">
        <el-input v-model="form.appointPost" :style="formLineWidth" placeholder="输入拟任职务" />
      </el-form-item>
      <el-form-item label="拟免职务" prop="removePost">
        <el-input v-model="form.removePost" :style="formLineWidth" placeholder="输入拟免职务" />
      </el-form-item>
      <el-form-item label="任免理由" prop="reason">
        <el-input v-model="form.reason" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" :style="formLineWidth" placeholder="输入任免理由" />
      </el-form-item>
      <el-form-item label="审批机关意见" prop="opinion">
        <el-input v-model="form.opinion" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" :style="formLineWidth" placeholder="输入任免理由" />
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
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import rules from '@/common/rules/appointment'
export default {
  name: 'AppointmentEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'appointment',
      formLineWidth: { width: '620px' },
      form: { personnelId: '', appointPost: '', removePost: '', reason: '', opinion: '' },
      rules
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData?.id ?? ''
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { personnelId: '', appointPost: '', removePost: '', reason: '', opinion: '' }
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
