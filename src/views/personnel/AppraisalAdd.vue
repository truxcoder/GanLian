<!--
 * @Author: truxcoder
 * @Date: 2021-11-18 17:41:42
 * @LastEditTime: 2022-01-26 15:13:57
 * @LastEditors: truxcoder
 * @Description: 添加考核数据
-->
<template>
  <el-dialog v-loading="dialogLoading" title="添加考核信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="rowdata" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>

      <el-form-item label="考核单位" prop="organId">
        <el-select v-model="form.organId" :style="formItemWidth" placeholder="请选择单位">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="考核年份" prop="years">
        <el-select v-model="form.years" :style="formItemWidth" placeholder="请选择考核年份">
          <el-option v-for="i in options.years" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="考核季度" prop="season">
        <el-select v-model="form.season" :style="formItemWidth" placeholder="请选择考核季度">
          <el-option v-for="i in options.season" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="考核结果" prop="conclusion">
        <el-select v-model="form.conclusion" :style="formItemWidth" placeholder="请选择考核结果">
          <el-option v-for="i in options.conclusion" :key="i" :label="i" :value="i" />
        </el-select>
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
import { mixin } from '@/common/mixin/appraisal'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'AppraisalAdd',
  components: { PersonnelOption },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resource: 'appraisal'
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData.id
      } else {
        this.form.personnelId = ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          curd('add', this.form, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('addSuccess')
              this.$refs.addForm.resetFields()
              // Object.keys(this.form).forEach(key => this.form[key]='')
            })
            .catch(err => {
              // this.$message.error(err.message)
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
      this.$emit('visibleChange', 'add')
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.$refs.addForm.resetFields()
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
</script>

<style></style>
