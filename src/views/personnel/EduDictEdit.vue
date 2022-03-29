<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-16 18:42:53
 * @LastEditors: truxcoder
 * @Description: 学历字典添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '学历字典信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :style="formItemWidth" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" :style="formItemWidth" placeholder="请选择分类">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="form.sort" :style="formItemWidth" />
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
export default {
  name: 'EduDictEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'edu_dict',
      form: { name: '', category: '', sort: 0 },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        category: [{ required: true, message: '请选择分类', trigger: 'change' }],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form = { ...this.row }
      } else {
        this.form = { name: '', category: '', sort: 0 }
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
