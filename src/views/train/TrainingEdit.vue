<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-06-08 14:50:48
 * @LastEditors: truxcoder
 * @Description: 培训信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '培训信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="培训标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="培训地点" prop="place">
        <el-input v-model="form.place" :style="formItemWidth" placeholder="请输入地点" />
      </el-form-item>
      <el-form-item label="培训分类" prop="category">
        <el-cascader v-model="form.category" :style="formItemWidth" :options="options.category" :show-all-levels="true" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="主办单位" prop="sponsor">
        <el-select v-model="form.sponsor" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="承办单位" prop="organizer">
        <el-select v-model="form.organizer" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="培训方式" prop="method">
        <el-cascader v-model="form.method" :style="formItemWidth" :options="options.method" :show-all-levels="true" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="学时" prop="period">
        <el-input v-model.number="form.period" type="number" :style="formItemWidth" placeholder="请输入学时(数字)" />
      </el-form-item>
      <el-form-item label="是否脱产" prop="isFullTime">
        <el-select v-model="form.isFullTime" :style="formItemWidth" placeholder="请选择性质">
          <el-option v-for="i in options.yesOrNo" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否仅本单位参加" prop="isInner">
        <el-select v-model="form.isInner" :style="formItemWidth" placeholder="请选择性质">
          <el-option v-for="i in options.yesOrNo" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="培训简介" prop="intro">
        <el-input v-model="form.intro" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" :style="formLineWidth" placeholder="输入培训简介" />
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
import rules from '@/common/rules/training'
export default {
  name: 'TrainingEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'training',
      form: { title: '', place: '', sponsor: '', organizer: '', method: '', category: '', period: '', isFullTime: '', isInner: '', startTime: '', endTime: '', intro: '' },
      rules,
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' },
      cascaderProps: { expandTrigger: 'hover', emitPath: false }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { title: '', place: '', sponsor: '', organizer: '', method: '', category: '', period: '', isFullTime: '', isInner: '', startTime: '', endTime: '', intro: '' }
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
