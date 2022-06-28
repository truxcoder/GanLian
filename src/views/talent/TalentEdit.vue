<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-05-26 11:45:28
 * @LastEditors: truxcoder
 * @Description: 人才信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '人才信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form
      v-if="visible"
      ref="editForm"
      class="add-form"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="action === 'update'" :style="formLineWidth" :value="row.personnelName" disabled />
        <PersonnelOption v-if="action === 'add'" v-model="form.personnelId" :rowdata="row" :is-update="action === 'update'" :form-item-width="formLineWidth" />
      </el-form-item>
      <el-form-item label="获得考官证时间" prop="beExaminerDay">
        <el-date-picker v-model="form.beExaminerDay" :style="formLineWidth" type="date" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="岗位标签" prop="skill">
        <!-- <el-input v-model="form.skill" :style="formLineWidth" /> -->
        <el-select v-model="form.skill" :style="formLineWidth" filterable allow-create multiple placeholder="请选择或输入岗位标签">
          <el-option v-for="i in talentSkillOption" :key="i.value" :label="i.label" :value="i.value" />
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
import { request, curd } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import rules from '@/common/rules/post'
import { talentSkillOption } from '@/utils/talent'
import { setDateFieldNull } from '@/utils/date'

export default {
  name: 'TalentEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  props: {
    category: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resource: 'talent',
      form: { personnelId: '', skill: '', category: 0, beExaminerDay: '' },
      rules
    }
  },
  computed: {
    talentSkillOption() {
      return talentSkillOption.filter(i => i.category === this.category)
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
          this.form.skill = JSON.parse(this.row.skill)
        } else {
          this.form.category = this.category
        }
        setDateFieldNull(this.form, ['beExaminerDay'])
      } else {
        this.form = { personnelId: '', skill: '', category: 0, beExaminerDay: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          this.form.skill = JSON.stringify(this.form.skill)
          const promise = this.action === 'add' ? request(this.resource, this.action, this.form) : curd(this.action, this.form, { resource: this.resource })
          promise.then(response => {
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
