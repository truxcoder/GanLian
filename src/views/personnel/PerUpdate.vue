<template>
  <el-dialog v-loading="dialogLoading" title="编辑人员信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item">
        <!-- <el-select v-if="item=='organId'" v-model="form[item]" :style="formItemWidth" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in organList" :key="i.id" :label="i.name" :value="i.id" />
        </el-select> -->

        <el-select
          v-if="models[item].type == 'SELECT'"
          v-model="form[item]"
          :style="models[item].multiple === true ? formTextAreaWidth : formItemWidth"
          :multiple="models[item].multiple === true"
          :filterable="models[item].multiple === true"
          :allow-create="models[item].multiple === true"
          :placeholder="'请选择' + models[item].label"
        >
          <el-option v-for="i in models[item].options" :key="i" :label="i" :value="i" />
        </el-select>

        <el-select
          v-else-if="models[item].type == 'SELECT2'"
          v-model="form[item]"
          :style="models[item].multiple === true ? formTextAreaWidth : formItemWidth"
          :multiple="models[item].multiple === true"
          :filterable="models[item].multiple === true"
          :allow-create="models[item].multiple === true"
          :placeholder="'请选择' + models[item].label"
        >
          <el-option v-for="(i, k) in models[item].options" :key="k" :label="i.label" :value="i.value" />
        </el-select>

        <el-autocomplete
          v-else-if="models[item].type == 'AUTOCOMPLETE'"
          v-model="form[item]"
          :style="formItemWidth"
          class="inline-input"
          :fetch-suggestions="models[item].suggestion"
          placeholder="请输入内容"
        />

        <el-date-picker v-else-if="models[item].type == 'DATE'" v-model="form[item]" :style="formItemWidth" :picker-options="pickerOptions" type="date" placeholder="选择日期" />
        <el-input v-else-if="models[item].type == 'NUMBER'" v-model.number="form[item]" :style="formItemWidth" autocomplete="off" />
        <el-input
          v-else-if="models[item].type == 'TEXT'"
          v-model="form[item]"
          :style="formTextAreaWidth"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="'请输入' + models[item].label"
        />
        <el-input v-else v-model="form[item]" :disabled="models[item].disabled" :style="formItemWidth" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { curd } from '@/api'
import { mixin } from '@/common/mixin/personnel'

export default {
  name: 'PersonnelUpdate',
  mixins: [mixin],
  props: {
    visible: {
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
      resource: 'personnel'
    }
  },
  watch: {
    rowdata: function(val, oldval) {
      // 因为Vue中父向子传值，数组和对象会传引用。直接修改props里面的值会直接影响父组件数据。Vue官方推荐用计算属性。
      // 这里想办法建立一个本地属性。用Json方法生生造了一个对象。
      // 重构：用spread语法
      // this.form = JSON.parse(JSON.stringify(val))
      this.form = { ...val }
      this.form.proCert = this.form.proCert ? this.form.proCert.split(',') : []
    }
  },
  methods: {
    onSubmit() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          console.log('updateForm----:', this.form)
          this.form.proCert = this.form.proCert.toString()
          curd('update', this.form, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              // let selected_dept
              // this.departmentList.forEach( item => {
              //   if (item.id === this.form.department_id){
              //     selected_dept = item.name
              //   }
              // })
              // this.form.department = { name: selected_dept }
              this.$emit('updateSuccess')
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
    onCancel() {
      this.$emit('visibleChange', 'update')
      this.$refs.updateForm.resetFields()
    }
  }
}
</script>

<style></style>
