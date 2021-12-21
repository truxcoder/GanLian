<template>
  <el-dialog v-loading="dialogLoading" title="添加人员信息" :width="dialogWidth" :visible.sync="formVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="formVisible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item">

        <el-select v-if="item=='organId'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in organList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>

        <el-select v-else-if="models[item].type=='SELECT'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in models[item].options" :key="i" :label="i" :value="i" />
        </el-select>

        <el-autocomplete v-else-if="models[item].type=='AUTOCOMPLETE'" v-model="form[item]" :style="formItemWidth" class="inline-input" :fetch-suggestions="models[item].suggestion" placeholder="请输入内容" @select="handleSelect" />

        <el-date-picker v-else-if="models[item].type=='DATE'" v-model="form[item]" :style="formItemWidth" type="date" placeholder="选择日期" />
        <el-input v-else-if="models[item].type=='NUMBER'" v-model.number="form[item]" :style="formItemWidth" autocomplete="off" />
        <el-input v-else-if="models[item].type=='TEXT'" v-model="form[item]" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :placeholder="'请输入'+models[item].label" />
        <el-input v-else v-model.trim="form[item]" :style="formItemWidth" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { personnelAdd } from '@/api/personnel'

// import rules from '@/common/rules/asset'
// import models from '@/common/model/asset'
import { mixin } from '@/common/mixin/personnel'
export default {
  name: 'PersonnelAdd',
  mixins: [mixin],
  props: {
    formVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.formItemData.forEach(key => this.$set(this.form, key, ''))
    // this.formItemData.forEach(key => this.form[key] = "")
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          console.log('this.form:', this.form)
          personnelAdd(this.form).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogLoading = false
            this.$emit('addSuccess')
            this.$refs.addForm.resetFields()
            // Object.keys(this.form).forEach(key => this.form[key]='')
          }).catch(err => {
            // this.$message.error(err.message)
            this.dialogLoading = false
          })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    onCancel() {
      this.$emit('addVisibleChange')
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style>

</style>
