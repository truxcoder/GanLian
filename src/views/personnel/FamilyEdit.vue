<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 11:24:30
 * @LastEditTime: 2022-03-16 21:32:45
 * @LastEditors: truxcoder
 * @Description: 添加修改出入境信息
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '家庭成员信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" :style="formItemWidth" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" :style="formItemWidth" placeholder="请选择性别">
          <el-option v-for="i in op.gender" :key="i" :label="i" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系" prop="relation">
        <el-select v-model="form.relation" :style="formItemWidth" allow-create placeholder="与本人关系">
          <el-option v-for="i in op.relation" :key="i" :label="i" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="政治面貌" prop="political">
        <el-select v-model="form.political" :style="formItemWidth" allow-create placeholder="政治面貌">
          <el-option v-for="i in op.political" :key="i" :label="i" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="organ">
        <el-input v-model="form.organ" :style="formItemWidth" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="职务" prop="post">
        <el-input v-model="form.post" :style="formItemWidth" placeholder="请输入职务" />
      </el-form-item>
      <el-form-item label="是否定居国外" prop="isAbroad">
        <el-select v-model="form.isAbroad" :style="formItemWidth" placeholder="请选择是或否">
          <el-option v-for="i in op.yn" :key="i.vaule" :label="i.label" :value="i.value" />
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
import rules from '@/common/rules/family'
import { politicalDict, relationDict } from '@/utils/dict'
export default {
  name: 'FamilyEdit',
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'family',
      form: { personnelId: '', name: '', gender: '', relation: '', political: '', organ: '', post: '', isAbroad: '' },
      rules
    }
  },
  computed: {
    op() {
      return {
        political: politicalDict,
        relation: relationDict,
        gender: ['男', '女'],
        yn: [{ label: '是', value: true }, { label: '否', value: false }]
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData?.id
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { personnelId: '', name: '', gender: '', relation: '', political: '', organ: '', post: '', isAbroad: '' }
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
