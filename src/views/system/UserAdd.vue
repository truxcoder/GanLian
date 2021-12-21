<template>
  <el-dialog v-loading="dialogLoading" title="添加用户" :visible.sync="addFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="addForm" :inline="true" :model="form" :rules="rules" size="medium" label-position="right">
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item" :label-width="formLabelWidth">
        <el-select v-if="item=='status'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in statusList" :key="i.label" :label="i.label" :value="i.value" />
        </el-select>
        <el-select v-else-if="item=='department_id'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in departmentList" :key="i.id" :label="i.name" :value="i.id" />
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
import { addUser } from '@/api/user'
import { mixin } from '@/common/mixin/user'
export default {
  name: 'UserAdd',
  mixins: [mixin],
  props: {
    addFormVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.formItemData.forEach(key => this.$set(this.form, key, ''))
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          addUser(this.form).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogLoading = false
            this.$emit('addDataSuccess')
            this.$refs.addForm.resetFields()
          }).catch(err => {
            console.log('err:', err)
            this.dialogLoading = false
          })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    onCancel() {
      this.$emit('addVisibleChange')
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style>

</style>
