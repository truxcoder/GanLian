<!--
 * @Author: truxcoder
 * @Date: 2021-11-15 16:26:18
 * @LastEditTime: 2022-01-11 17:37:40
 * @LastEditors: truxcoder
 * @Description: 添加职务信息
-->
<template>
  <el-dialog v-loading="dialogLoading" title="添加职务信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item">
        <el-select v-if="item == 'levelId'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择' + models[item].label">
          <el-option v-for="i in passedData" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>

        <el-select v-else-if="models[item].type == 'SELECT'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择' + models[item].label">
          <el-option v-for="i in models[item].options" :key="i.label" :label="i.label" :value="i.value" />
        </el-select>

        <el-autocomplete
          v-else-if="models[item].type == 'AUTOCOMPLETE'"
          v-model="form[item]"
          :style="formItemWidth"
          class="inline-input"
          :fetch-suggestions="models[item].suggestion"
          placeholder="请输入内容"
          @select="handleSelect"
        />

        <el-date-picker v-else-if="models[item].type == 'DATE'" v-model="form[item]" :style="formItemWidth" type="date" placeholder="选择日期" />
        <el-input v-else-if="models[item].type == 'NUMBER'" v-model.number="form[item]" :style="formItemWidth" autocomplete="off" />
        <el-input
          v-else-if="models[item].type == 'TEXT'"
          v-model="form[item]"
          :style="formTextAreaWidth"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="'请输入' + models[item].label"
        />
        <el-input v-else v-model="form[item]" :style="formItemWidth" autocomplete="off" />
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

import { mixin } from '@/common/mixin/position'
export default {
  name: 'PositionAdd',
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resource: 'position'
    }
  },
  mounted() {
    this.formItemData.forEach(key => this.$set(this.form, key, ''))
    // this.formItemData.forEach(key => this.form[key] = "")
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
    }
  }
}
</script>

<style></style>
