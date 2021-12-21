<template>
  <el-dialog v-loading="dialogLoading" title="添加任职信息" :width="dialogWidth" :visible.sync="formVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="formVisible" ref="addForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="rowdata" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>

      <el-form-item label="任职部门" prop="departmentId">
        <el-select v-model="form.departmentId" :style="formItemWidth" filterable placeholder="请选择部门">
          <el-option v-for="i in options.department" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="任职单位" prop="organId">
        <el-select v-model="form.organId" :style="formItemWidth" placeholder="请选择单位">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="所任职务" prop="positionId">
        <el-select v-model="form.positionId" :style="formItemWidth" filterable placeholder="请选择职务">
          <el-option v-for="i in options.position" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="所任级别" prop="levelId">
        <el-select v-model="form.levelId" :style="formItemWidth" filterable placeholder="请选择级别">
          <el-option v-for="i in options.level" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="任职开始日期" prop="startDay">
        <el-date-picker v-model="form.startDay" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="任职结束日期" prop="endDay">
        <el-date-picker v-model="form.endDay" :style="formItemWidth" type="date" placeholder="选择日期" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postAdd } from '@/api/post'
import { mixin } from '@/common/mixin/post'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'PostAdd',
  components: { PersonnelOption },
  mixins: [mixin],
  props: {
    formVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formVisible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData.id
      } else {
        this.form.personnelId = ''
      }
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
          console.log('this.form:', this.form)
          if (this.form.endDay === '') {
            const d = new Date('2100-01-01')
            this.form.endDay = d
          }
          postAdd(this.form)
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
    handleSelect(item) {
      console.log(item)
    },
    onCancel() {
      this.$emit('addVisibleChange')
      this.$refs.addForm.resetFields()
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
</script>

<style></style>
