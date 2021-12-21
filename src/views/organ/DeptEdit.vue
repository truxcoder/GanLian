<template>
  <el-dialog v-loading="dialogLoading" title="编辑部门" :visible.sync="editFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="editForm" :inline="false" :model="form" :rules="rules" size="medium" label-position="right">
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item" :label-width="formLabelWidth">
        <el-select v-if="item==='isentity'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in entityList" :key="i.label" :label="i.label" :value="i.value" />
        </el-select>
        <el-select v-else-if="item=='parent'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in newDeptList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
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
import { updateDepartment } from '@/api/department'
import { mixin } from '@/common/mixin/department'
export default {
  name: 'DeptEdit',
  mixins: [mixin],
  props: {
    editFormVisible: {
      type: Boolean,
      default: false
    },
    currentEditData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    currentEditData: function(val, oldval) {
      this.form = { ...val }
    }
  },
  mounted() {
    this.formItemData.forEach(key => this.$set(this.form, key, ''))
  },
  methods: {
    visibleChange() {
      this.$emit('editVisibleChange')
    },
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          updateDepartment(this.form).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogLoading = false
            this.$emit('updateDataSuccess')
            this.$refs.addForm.resetFields()
          }).catch(err => {
            this.dialogLoading = false
          })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    onCancel() {
      this.$emit('editVisibleChange')
      this.$refs.editForm.resetFields()
    }
  }
}
</script>

<style>

</style>
