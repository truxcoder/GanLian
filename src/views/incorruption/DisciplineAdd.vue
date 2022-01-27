<template>
  <el-dialog v-loading="dialogLoading" title="添加处理信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="rowdata" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
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
import { curd } from '@/api/index'
import { mixin } from '@/common/mixin/discipline'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'DisciplineAdd',
  components: { PersonnelOption },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resource: 'discipline'
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData.id
      } else {
        this.form.personnelId = ''
      }
    }
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
    onCancel() {
      this.personnelOpitons = []
      this.$emit('visibleChange', 'add')
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
