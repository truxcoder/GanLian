<template>
  <el-dialog v-loading="dialogLoading" title="编辑奖励信息" :width="dialogWidth" :visible.sync="formVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="formVisible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="rowdata" :is-update="true" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" :style="formItemWidth" placeholder="请选择分类">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="等级/奖励项" prop="grade">
        <el-select v-model="form.grade" :style="formItemWidth" placeholder="请选择等级/奖励项">
          <el-option v-for="i in gradeList" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="奖励时间" prop="getTime">
        <el-date-picker v-model="form.getTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="文号" prop="docNumber">
        <el-input v-model="form.docNumber" :style="formItemWidth" placeholder="输入文号" />
      </el-form-item>

      <el-form-item label="奖励内容" prop="content">
        <el-input v-model="form.content" :style="formItemWidth" placeholder="输入奖励内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { awardUpdate } from '@/api/award'
import { mixin } from '@/common/mixin/award'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'AwardUpdate',
  components: { PersonnelOption },
  mixins: [mixin],
  props: {
    formVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      testData: this.rowdata
    }
  },
  watch: {
    formVisible: function(val, oldval) {
      if (val === true) {
        this.form = { ...this.rowdata }
      } else {
        this.form = { personnelId: '', category: '', getTime: '', grade: '', content: '', docNumber: '' }
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          awardUpdate(this.form)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.personnelOpitons = []
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
      this.personnelOpitons = []
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
