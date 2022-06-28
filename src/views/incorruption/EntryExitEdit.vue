<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 11:24:30
 * @LastEditTime: 2022-04-01 14:51:57
 * @LastEditors: truxcoder
 * @Description: 添加修改出入境信息
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '出入境信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <PersonnelOption v-if="!isSingle" v-model="form.personnelId" :rowdata="row" :is-update="action === 'update'" :form-item-width="formItemWidth" />
      </el-form-item>

      <el-form-item label="所用证件" prop="passport">
        <el-select v-model="form.passport" :style="formItemWidth" filterable allow-create placeholder="请选择证件">
          <el-option v-for="i in options.passport" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="目的地" prop="destination">
        <el-input v-model="form.destination" :style="formItemWidth" placeholder="请输入目的地" />
      </el-form-item>

      <el-form-item label="出境事由" prop="aim">
        <el-select v-model="form.aim" :style="formItemWidth" filterable allow-create placeholder="请选择或输入出境事由">
          <el-option v-for="(v, i) in options.aim" :key="i" :label="v" :value="v" />
        </el-select>
      </el-form-item>

      <el-form-item label="出境时间" prop="exitTime">
        <el-date-picker v-model="form.exitTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="入境时间" prop="enterTime">
        <el-date-picker v-model="form.enterTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="是否报备" prop="isReport">
        <el-select v-model="form.isReport" :style="formItemWidth">
          <el-option v-for="i in options.isReport" :key="i.value" :label="i.label" :value="i.value" />
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
import { edit_mixin } from '@/common/mixin/edit'
import rules from '@/common/rules/entry_exit'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'EntryExitEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'entry_exit',
      form: { personnelId: '', passport: '', enterTime: '', exitTime: '', destination: '', aim: '', isReport: '' },
      rules
    }
  },
  computed: {
    organMap() {
      const newMap = {}
      this.$store.getters.organs.forEach(item => (newMap[item.busOrgCode] = item))
      return newMap
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData?.id ?? ''
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { personnelId: '', passport: '', enterTime: '', exitTime: '', destination: '', aim: '', isReport: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          console.log('this.form:', this.form)
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
