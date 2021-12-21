<template>
  <el-dialog v-loading="dialogLoading" title="编辑考核信息" :width="dialogWidth" :visible.sync="formVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="formVisible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="rowdata" :is-update="true" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
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

      <el-form-item label="考核结果" prop="conclusion">
        <el-select v-model="form.conclusion" :style="formItemWidth" placeholder="请选择考核结果">
          <el-option v-for="i in options.conclusion" :key="i.vaule" :label="i.label" :value="i.value" />
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
import { appraisalUpdate } from '@/api/appraisal'
import { mixin } from '@/common/mixin/appraisal'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'AppraisalUpdate',
  components: { PersonnelOption },
  mixins: [mixin],
  props: {
    formVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rowdata: function(val, oldval) {
      this.form = { ...val }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          appraisalUpdate(this.form)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('updateSuccess', this.form)
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
      this.$emit('updateVisibleChange')
      this.$refs.updateForm.resetFields()
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
</script>

<style></style>
