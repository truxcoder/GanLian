<!--
 * @Author: truxcoder
 * @Date: 2022-02-15 10:13:03
 * @LastEditTime: 2022-08-04 09:39:32
 * @LastEditors: truxcoder
 * @Description: 添加和修改举报信息
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '信访举报信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form
      v-if="visible"
      ref="addForm"
      :inline="true"
      class="add-form"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
      <el-form-item label="举报标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="涉及人员">
        <PersonMultiSelect :form-item-width="formLineWidth" :is-update="action === 'update'" :persons="persons" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="受理时间" prop="reportTime">
        <el-date-picker v-model="form.reportTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="当前阶段" prop="step">
        <el-select v-model="form.step" :style="formItemWidth" placeholder="请选择分类">
          <el-option v-for="i in options.step" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="举报处置情况" prop="intro">
        <el-input v-model="form.intro" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="输入处理内容" />
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
import PersonMultiSelect from '@/components/Personnel/PersonMultiSelect.vue'

import rules from '@/common/rules/report'

const array = require('lodash/array')
// const _ = require('lodash')
export default {
  name: 'ReportEdit',
  components: { PersonMultiSelect },
  mixins: [edit_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resource: 'report',
      form: { title: '', reportTime: '', step: '', intro: '' },
      rules,
      personnels: '',
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' }
    }
  },
  computed: {
    persons() {
      return this.row.personnels ?? []
    },
    orginIDs() {
      return this.row?.personnels ? this.row.personnels.map(item => item.id) : []
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        if (this.action === 'update') {
          this.personnels = [...this.orginIDs]
          for (const key in this.form) {
            console.log('key:', key)
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
          this.fetchData()
        }
      } else {
        this.form = { title: '', reportTime: '', step: '', intro: '' }
        this.personnels = ''
        this.$refs.addForm.resetFields()
        this.personnelOpitons = []
      }
    }
  },
  methods: {
    fetchData() {
      this.dialogLoading = true
      request(this.resource, 'one', { id: this.row.id }).then(response => {
        this.form.intro = response.data?.intro ?? ''
        this.dialogLoading = false
      })
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          let data = {}
          this.personnels = this.personnels ?? []
          if (this.personnels === '') {
            this.personnels = []
          }
          if (this.action === 'add') {
            data = { report: this.form, person: this.personnels }
          } else if (this.action === 'update') {
            const added = array.difference(this.personnels, this.orginIDs)
            const deled = array.difference(this.orginIDs, this.personnels)
            console.log('added:', added)
            console.log('deled:', deled)
            if (added.length === 0 && deled.length === 0) {
              data = { report: this.form, current: this.personnels }
            } else if (added.length > 0 && deled.length > 0) {
              data = { report: this.form, add: added, del: deled, current: this.personnels }
            } else if (added.length > 0) {
              data = { report: this.form, add: added, current: this.personnels }
            } else if (deled.length > 0) {
              data = { report: this.form, del: deled, current: this.personnels }
            } else {
              this.$message.error('有错误发生!')
              this.dialogLoading = false
              return false
            }
          } else {
            this.$message.error('未指定action!')
            this.dialogLoading = false
            return false
          }
          const content = {
            action: this.action,
            data: JSON.stringify(data)
          }
          data = {
            personnelId: this.$store.getters.personnelId,
            organId: this.$store.getters.organ,
            category: 102,
            content: JSON.stringify(content)
          }
          request('pre', null, data)
          // request(this.resource, this.action, data)
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
    },
    onPersonnelChange(value) {
      this.personnels = value
    }
  }
}
</script>

<style></style>
