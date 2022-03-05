<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-03 18:48:48
 * @LastEditors: truxcoder
 * @Description: 人员角色信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '人员角色信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="editForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option :rowdata="personnelOption" :is-update="action === 'update'" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" :style="formItemWidth" placeholder="请选择角色">
          <el-option v-for="i in options.role" :key="i.value" :label="i.label" :value="i.value" />
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
import { request } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import rules from '@/common/rules/role'
export default {
  name: 'RoleEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'role',
      form: { personnelId: '', role: '' },
      rules
    }
  },
  computed: {
    personnelOption() {
      return { personnelId: this.row.id, personnelName: this.row.name, role: this.row.role, policeCode: this.row.policeCode }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        if (this.action === 'update') {
          this.form.personnelId = this.row.id
          this.form.role = this.row.role
        }
      } else {
        this.form = { personnelId: '', role: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          let data = this.form
          if (this.action === 'update') {
            data = { old: [this.row.id, this.row.role], new: [this.form.personnelId, this.form.role] }
          }
          // const data =
          //   this.action === 'update'
          //     ? {
          //         old: [this.rowdata.id, this.rowdata.role],
          //         new: [this.form.personnelId, this.form.role]
          //       }
          //     : this.form
          request(this.resource, this.action, data)
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
