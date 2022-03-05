<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-03 16:30:04
 * @LastEditors: truxcoder
 * @Description: 职务添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '职务信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="editForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :style="formItemWidth" />
      </el-form-item>
      <el-form-item label="是否为领导职务" prop="isLeader">
        <el-select v-model="form.isLeader" :style="formItemWidth" placeholder="请选择是或否">
          <el-option v-for="i in op.yesOrNo" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="性质" prop="isChief">
        <el-select v-model="form.isChief" :style="formItemWidth" placeholder="请选择性质">
          <el-option v-for="i in op.chiefOrVice" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="级别" prop="levelId">
        <el-select v-model="form.levelId" :style="formItemWidth" placeholder="请选择级别">
          <el-option v-for="i in levels" :key="i.id" :label="i.name" :value="i.id" />
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
import rules from '@/common/rules/position'
export default {
  name: 'PositionEdit',
  mixins: [edit_mixin],
  props: {
    levels: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      resource: 'position',
      form: { name: '', isLeader: '', isChief: '', levelId: '' },
      rules
    }
  },
  computed: {
    op() {
      const yesOrNo = [
        { label: '是', value: 2 },
        { label: '否', value: 1 }
      ]
      const chiefOrVice = [
        { label: '正职', value: 2 },
        { label: '副职', value: 1 }
      ]
      return { yesOrNo, chiefOrVice }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { name: '', isLeader: '', isChief: '', levelId: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
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
