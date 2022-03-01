<!--
 * @Author: truxcoder
 * @Date: 2022-02-15 10:13:03
 * @LastEditTime: 2022-02-17 11:29:48
 * @LastEditors: truxcoder
 * @Description: 添加举报步骤信息
-->
<template>
  <el-dialog
    v-loading="dialogLoading"
    title="添加举报步骤"
    :width="dialogWidth"
    :visible.sync="visible"
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form v-if="visible" ref="addForm" :inline="true" :model="stepForm" :rules="stepRules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="阶段" prop="step">
        <el-select v-model="stepForm.step" :style="formItemWidth" placeholder="请选择阶段">
          <el-option v-for="i in options.step" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="受理时间" prop="time">
        <el-date-picker v-model="stepForm.time" :style="formItemWidth" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="本阶段内容简介" prop="content">
        <el-input v-model="stepForm.content" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="输入本阶段主要内容" />
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
var lang = require('lodash/lang')
import { mixin } from '@/common/mixin/report'
export default {
  name: 'ReportStepAdd',
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      resource: 'report',
      currentData: []
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.currentData = lang.cloneDeep(this.steps)
      } else {
        this.currentData = []
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // this.dialogLoading = true
          this.currentData.push(this.stepForm)
          console.log('currentData:', this.currentData)
          this.currentData.sort((a, b) => b.step - a.step)
          const steps = JSON.stringify(this.currentData)
          const data = { id: this.row.id, steps }
          const params = { resource: this.resource }
          curd('update', data, params)
            .then(response => {
              this.$message.success(response.message)
              this.dialogLoading = false
              this.$emit('addSuccess')
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
    onCancel() {
      this.$refs.addForm.resetFields()
      this.$emit('visibleChange', 'add')
    }
  }
}
</script>

<style></style>
