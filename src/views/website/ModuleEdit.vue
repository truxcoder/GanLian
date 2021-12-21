<template>
  <el-dialog v-loading="dialogLoading" title="编辑模块" :visible.sync="cpnVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="editForm" :inline="true" :model="form" :rules="rules" size="medium" label-position="right">
      <el-form-item v-for="formitem in formItemData" :key="formitem" :label="models[formitem].label" :prop="formitem" :label-width="formLabelWidth">
        <el-select v-if="formitem==='rank'" v-model="form[formitem]" :style="formItemWidth" :placeholder="'请选择'+models[formitem].label">
          <el-option v-for="i in rankList" :key="i.label" :label="i.label" :value="i.value" />
        </el-select>
        <el-select v-else-if="formitem==='parent'" v-model.number="form[formitem]" :style="formItemWidth" :placeholder="'请选择'+models[formitem].label">
          <el-option v-for="i in newModuleList" :key="i.id" :label="i.title" :value="i.id" />
        </el-select>
        <el-autocomplete
          v-else-if="formitem==='icon'"
          v-model="form[formitem]"
          :style="formItemWidth"
          popper-class="iconList"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <i slot="suffix" class="el-icon-edit" />
          <template slot-scope="{ item }">
            <i class="iconItem" :class="item.value" />
          </template>
        </el-autocomplete>
        <el-input v-else-if="models[formitem].type=='NUMBER'" v-model.number="form[formitem]" :style="formItemWidth" autocomplete="off" />
        <el-input v-else v-model="form[formitem]" :style="formItemWidth" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateModule } from '@/api/module'
import { mixin } from '@/common/mixin/module'
export default {
  name: 'ModuleEdit',
  mixins: [mixin],
  props: {
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    rowdata: function(val, oldval) {
      this.form = { ...val }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if ((this.form.parent === 0 && this.form.rank !== 1) || (this.form.parent !== 0 && this.form.rank === 1)) {
            this.$message.error('模块级别和父组件不匹配！')
            return
          }
          this.dialogLoading = true
          updateModule(this.form).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogLoading = false
            this.$emit('updateDataSuccess', this.form)
          }).catch(err => {
            // this.$message.error(err.message)
            this.dialogLoading = false
          })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    onCancel() {
      this.$emit('visibleChange')
      this.$refs.editForm.resetFields()
    }
  }
}
</script>

<style>

</style>
