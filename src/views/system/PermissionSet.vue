<!--
 * @Author: truxcoder
 * @Date: 2021-12-13 17:15:04
 * @LastEditTime: 2022-01-20 21:02:44
 * @LastEditors: truxcoder
 * @Description: 重构分配权限
-->
<template>
  <el-dialog v-loading="dialogLoading" title="添加角色信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <personnel-option :rowdata="rowdata" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" :style="formItemWidth" placeholder="请选择角色">
          <el-option v-for="i in options" :key="i.value" :label="i.label" :value="i.value" />
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
import { roleAdd } from '@/api/role'
import { mixin } from '@/common/mixin/role'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'RoleAdd',
  components: { PersonnelOption },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: function(val, oldval) {
      this.form.personnelId = ''
      // if (val === true) {
      //   this.form.personnelId = this.singlePersonnelData.id
      // } else {
      //   this.form.personnelId = ''
      // }
    }
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          roleAdd(this.form)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('addSuccess')
              this.$refs.addForm.resetFields()
              this.personnelOpitons = []
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
    handleSelect(item) {
      console.log(item)
    },
    onCancel() {
      this.personnelOpitons = []
      this.$emit('addVisibleChange')
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
