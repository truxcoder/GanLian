<template>
  <el-dialog v-loading="dialogLoading" title="编辑职务信息" :width="dialogWidth" :visible.sync="formVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="formVisible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item">

        <el-select v-if="item=='levelId'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in passedData" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>

        <el-select v-else-if="models[item].type=='SELECT'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in models[item].options" :key="i.label" :label="i.label" :value="i.value" />
        </el-select>

        <el-autocomplete v-else-if="models[item].type=='AUTOCOMPLETE'" v-model="form[item]" :style="formItemWidth" class="inline-input" :fetch-suggestions="models[item].suggestion" placeholder="请输入内容" @select="handleSelect" />

        <el-date-picker v-else-if="models[item].type=='DATE'" v-model="form[item]" :style="formItemWidth" type="date" placeholder="选择日期" />
        <el-input v-else-if="models[item].type=='NUMBER'" v-model.number="form[item]" :style="formItemWidth" autocomplete="off" />
        <el-input v-else-if="models[item].type=='TEXT'" v-model="form[item]" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :placeholder="'请输入'+models[item].label" />
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
import { positionUpdate } from '@/api/position'
import { mixin } from '@/common/mixin/position'
export default {
  name: 'PositionUpdate',
  mixins: [mixin],
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
          positionUpdate(this.form).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogLoading = false
            this.$emit('updateSuccess', this.form)
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
      this.$emit('updateVisibleChange')
      this.$refs.updateForm.resetFields()
    }
  }
}
</script>

<style>

</style>
