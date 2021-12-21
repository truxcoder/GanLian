<template>
  <el-dialog v-loading="dialogLoading" title="编辑级别信息" :width="dialogWidth" :visible.sync="formVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="formVisible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="名称" :prop="name">
        <el-input v-model="form.name" :style="formItemWidth" />
      </el-form-item>
      <el-form-item label="排序" :prop="order">
        <el-input v-model.number="form.order" :style="formItemWidth" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { levelUpdate } from '@/api/level'
export default {
  name: 'LevelUpdate',
  props: {
    formVisible: {
      type: Boolean,
      default: false
    },
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { name: '', order: 0 },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
        ]
      },
      dialogLoading: false
    }
  },
  watch: {
    rowdata: function(val, oldval) {
      // 因为Vue中父向子传值，数组和对象会传引用。直接修改props里面的值会直接影响父组件数据。Vue官方推荐用计算属性。
      // 这里想办法建立一个本地属性。用Json方法生生造了一个对象。
      // 重构：用spread语法
      // this.form = JSON.parse(JSON.stringify(val))
      this.form = { ...val }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          levelUpdate(this.form)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('updateSuccess', this.form)
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
      this.$emit('updateVisibleChange')
      this.$refs.updateForm.resetFields()
    }
  }
}
</script>

<style></style>
