<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-03 10:50:51
 * @LastEditors: truxcoder
 * @Description: 处分信息添加编辑
-->
<template>
  <el-dialog
    v-loading="dialogLoading"
    :title="actName + '举报处理过程'"
    :width="dialogWidth"
    :visible.sync="visible"
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form v-if="visible" ref="editForm" :inline="true" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="阶段" prop="step">
        <el-select v-model="form.step" :style="formItemWidth" placeholder="请选择阶段">
          <el-option v-for="i in options.step" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="受理时间" prop="time">
        <el-date-picker v-model="form.time" :style="formItemWidth" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="本阶段内容简介" prop="content">
        <el-input v-model="form.content" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="输入本阶段主要内容" />
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
var lang = require('lodash/lang')
export default {
  name: 'ReportStepEdit',
  mixins: [edit_mixin],
  props: {
    steps: {
      type: Array,
      default() {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resource: 'report',
      currentData: [],
      form: { step: '', time: '', content: '' },
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' },
      rules: {
        content: [{ required: true, message: '请输入本步骤主要内容', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        step: [{ required: true, message: '请选择阶段', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.currentData = lang.cloneDeep(this.steps)
        if (this.action === 'update') {
          this.form = { ...this.currentData[this.index] }
        }
      } else {
        this.form = { step: '', time: '', content: '' }
        this.currentData = []
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          if (this.action === 'add') {
            this.currentData.push(this.form)
          } else {
            this.currentData[this.index] = this.form
          }
          this.currentData.sort((a, b) => b.step - a.step)
          const steps = JSON.stringify(this.currentData)
          const data = { id: this.row.id, steps }
          curd('update', data, { resource: this.resource })
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
