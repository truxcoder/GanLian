<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-08-04 10:55:17
 * @LastEditors: truxcoder
 * @Description: 处分信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '处分信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" :style="formItemWidth" placeholder="请选择分类" @change="onCategoryChange">
          <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理项" prop="dictId">
        <el-select v-model="form.dictId" :style="formItemWidth" placeholder="请选择处理项">
          <el-option v-for="i in disDictList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="处理时间" prop="getTime">
        <el-date-picker v-model="form.getTime" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="文号" prop="docNumber">
        <el-input v-model="form.docNumber" :style="formItemWidth" placeholder="输入文号" />
      </el-form-item>

      <el-form-item label="决定机关" prop="organ">
        <el-input v-model="form.organ" :style="formItemWidth" placeholder="输入决定机关" />
      </el-form-item>

      <el-form-item label="影响期至" prop="deadline">
        <el-date-picker v-model="form.deadline" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="处理内容" prop="content">
        <el-input v-model="form.content" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="输入处理内容" />
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
import rules from '@/common/rules/discipline'
export default {
  name: 'DisciplineEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  props: {
    disDict: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      resource: 'discipline',
      form: { personnelId: '', category: '', getTime: '', dictId: '', content: '', docNumber: '', deadline: '', organ: '' },
      rules
    }
  },
  computed: {
    disDictList() {
      return this.disDict.filter(item => item.category === this.form.category)
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
        this.form = { personnelId: '', category: '', getTime: '', dictId: '', content: '', docNumber: '', deadline: '', organ: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const content = {
            action: this.action,
            data: JSON.stringify(this.form)
          }
          const data = {
            personnelId: this.$store.getters.personnelId,
            organId: this.$store.getters.organ,
            category: 101,
            content: JSON.stringify(content)
          }
          // curd(this.action, this.form, { resource: this.resource })
          request('pre', null, data)
            .then(response => {
              this.$message.success(response.message)
              this.dialogLoading = false
              // this.$emit('editSuccess')
              this.$emit('visibleChange', 'edit')
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
    onCategoryChange() {
      this.form.dictId = ''
    }
  }
}
</script>

<style></style>
