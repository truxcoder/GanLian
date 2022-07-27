<!--
 * @Author: truxcoder
 * @Date: 2022-05-12 18:53:20
 * @LastEditTime: 2022-06-29 10:14:30
 * @LastEditors: truxcoder
 * @Description: 人员教育情况编辑页
-->
<template>
  <el-dialog v-loading="dialogLoading" title="编辑人员教育情况" width="1000px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="全日制教育学历" prop="fullTimeEdu">
        <el-cascader v-model="form.fullTimeEdu" :style="formItemWidth" :options="eduOptions" :show-all-levels="false" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="全日制教育学位" prop="fullTimeDegree">
        <el-cascader v-model="form.fullTimeDegree" :style="formItemWidth" :options="degreeOptions" clearable filterable :show-all-levels="false" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="全日制教育专业" prop="fullTimeMajor">
        <el-autocomplete v-model.trim="form.fullTimeMajor" :style="formItemWidth" :fetch-suggestions="majorSuggestion" placeholder="请输入关键词" />
      </el-form-item>
      <el-form-item label="全日制毕业院校" prop="fullTimeSchool">
        <el-input v-model.trim="form.fullTimeSchool" :style="formItemWidth" placeholder="请输入院校全称" />
      </el-form-item>

      <el-form-item label="在职教育学历" prop="partTimeEdu">
        <el-cascader v-model="form.partTimeEdu" :style="formItemWidth" :options="eduOptions" clearable :show-all-levels="false" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="在职教育学位" prop="partTimeDegree">
        <el-cascader v-model="form.partTimeDegree" :style="formItemWidth" :options="degreeOptions" clearable filterable :show-all-levels="false" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="在职教育专业" prop="partTimeMajor">
        <el-autocomplete v-model.trim="form.partTimeMajor" :style="formItemWidth" :fetch-suggestions="majorSuggestion" placeholder="请输入关键词" />
      </el-form-item>
      <el-form-item label="在职教育毕业院校" prop="partTimeSchool">
        <el-input v-model.trim="form.partTimeSchool" :style="formItemWidth" placeholder="请输入院校全称" />
      </el-form-item>

      <el-form-item label="最高教育学历" prop="finalEdu">
        <el-cascader v-model="form.finalEdu" :style="formItemWidth" :options="eduOptions" :show-all-levels="false" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="最高教育学位" prop="finalDegree">
        <el-cascader v-model="form.finalDegree" :style="formItemWidth" :options="degreeOptions" clearable filterable :show-all-levels="false" :props="cascaderProps" />
      </el-form-item>
      <el-form-item label="最高教育专业" prop="finalMajor">
        <el-autocomplete v-model.trim="form.finalMajor" :style="formItemWidth" :fetch-suggestions="majorSuggestion" placeholder="请输入关键词" />
      </el-form-item>
      <el-form-item label="最高教育毕业院校" prop="finalSchool">
        <el-input v-model.trim="form.finalSchool" :style="formItemWidth" placeholder="请输入院校全称" />
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
import { eduOptions, degreeOptions } from '@/utils/dict_edu'
import { suggestions } from '@/common/model/suggestions'
import rules from '@/common/rules/edu'

export default {
  name: 'PersonnelEduEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'personnel',
      eduOptions: eduOptions,
      degreeOptions: degreeOptions,
      majorSuggestion: suggestions.querySubject,
      formLabelWidth: '160px',
      formItemWidth: { width: '300px' },
      cascaderProps: { expandTrigger: 'hover', emitPath: false },
      originForm: {},
      rules,
      form: { id: '', fullTimeEdu: '', fullTimeDegree: '', fullTimeMajor: '', fullTimeSchool: '', partTimeEdu: '', partTimeDegree: '', partTimeMajor: '', partTimeSchool: '', finalEdu: '', finalDegree: '', finalMajor: '', finalSchool: '' }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        for (const key in this.form) {
          this.form[key] = this.row[key]
          this.originForm[key] = this.row[key]
        }
      } else {
        this.form = { id: '', fullTimeEdu: '', fullTimeDegree: '', fullTimeMajor: '', fullTimeSchool: '', partTimeEdu: '', partTimeDegree: '', partTimeMajor: '', partTimeSchool: '', finalEdu: '', finalDegree: '', finalMajor: '', finalSchool: '' }
        this.originForm = {}
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    isDataChanged() {
      for (const i in this.form) {
        if (this.form[i] !== this.originForm[i]) {
          return true
        }
      }
      return false
    },
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          if (!this.isDataChanged()) {
            this.$message.info('未修改任何数据')
            this.dialogLoading = false
            this.$emit('visibleChange', 'edu')
            return false
          }
          let result
          if (!this.can?.manage) {
            const data = {
              personnelId: this.form.id,
              organId: this.$store.getters.organ,
              category: 2,
              content: JSON.stringify(this.form)
            }
            result = request('pre', null, data)
          } else {
            result = request('personnel', 'update_edu', this.form)
          }
          result.then(response => {
            this.$message.success(response.message)
            this.dialogLoading = false
            this.$emit('editSuccess', 'edu')
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
      this.$emit('visibleChange', 'edu')
    }
  }
}
</script>

<style></style>
