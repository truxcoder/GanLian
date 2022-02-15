<template>
  <el-dialog v-loading="dialogLoading" title="编辑培训信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="培训标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="培训地点" prop="place">
        <el-input v-model="form.place" :style="formLineWidth" placeholder="请输入地点" />
      </el-form-item>
      <el-form-item label="组织单位" prop="organ">
        <el-select v-model="form.organ" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位名称">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织部门" prop="department">
        <el-select v-model="form.department" :style="formItemWidth" filterable allow-create placeholder="请选择或输入部门名称">
          <el-option v-for="i in options.department" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="性质" prop="property">
        <el-select v-model="form.property" :style="formItemWidth" placeholder="请选择性质">
          <el-option v-for="i in options.property" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学时" prop="period">
        <el-input v-model.number="form.period" type="number" :style="formItemWidth" placeholder="请输入学时(数字)" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" :style="formItemWidth" type="date" placeholder="选择日期" />
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
import { mixin } from '@/common/mixin/training'
export default {
  name: 'TrainingUpdate',
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resource: 'training'
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form = { ...this.rowdata }
      } else {
        this.form = { title: '', place: '', organ: '', department: '', property: '', period: '', startTime: '', endTime: '', intro: '' }
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          curd('update', this.form, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('updateSuccess')
              this.$refs.addForm.resetFields()
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
      this.personnelOpitons = []
      this.$emit('visibleChange', 'update')
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style></style>
