<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-05-26 17:41:21
 * @LastEditors: truxcoder
 * @Description: 人才信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" title="人才抽取" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" />
      </el-form-item>
      <el-form-item label="人数" prop="total">
        <el-input v-model.number="form.total" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">抽 取</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import rules from '@/common/rules/post'

export default {
  name: 'TalentEdit',
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
      form: { title: '', total: 0 },
      rules
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.pickerId = this.$store.getters.personnelId
        this.form.category = this.category
      } else {
        this.form = { title: '', total: 0 }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          request('talent', 'pick_add', this.form).then(response => {
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
