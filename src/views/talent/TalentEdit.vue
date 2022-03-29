<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-29 16:54:45
 * @LastEditors: truxcoder
 * @Description: 人才信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '人才信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form
      v-if="visible"
      ref="editForm"
      class="add-form"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formLineWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="row" :is-update="action === 'update'" :form-item-width="formLineWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="技能" prop="skill">
        <el-input v-model="form.skill" :style="formLineWidth" />
      </el-form-item>
      <el-form-item label="测试">
        <IconPicker v-model="kkkkk" :width="formItemWidth.width" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request, curd } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import rules from '@/common/rules/post'

import IconPicker from '@/components/SvgIcon/IconPicker.vue'

export default {
  name: 'TalentEdit',
  components: { PersonnelOption, IconPicker },
  mixins: [edit_mixin],
  props: {
    category: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resource: 'talent',
      form: { personnelId: '', skill: '', category: 0 },
      rules,
      kkkkk: ''
    }
  },
  computed: {
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData?.id ?? ''
        this.kkkkk = ''
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        } else {
          this.form.category = this.category
        }
      } else {
        this.form = { personnelId: '', skill: '', category: 0 }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const promise = this.action === 'add' ? request(this.resource, this.action, this.form) : curd(this.action, this.form, { resource: this.resource })
          promise.then(response => {
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
