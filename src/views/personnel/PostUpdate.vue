<template>
  <el-dialog v-loading="dialogLoading" title="编辑任职信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="rowdata" :is-update="true" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>

      <el-form-item label="任职部门" prop="department">
        <el-select v-model="form.department" :style="formItemWidth" filterable allow-create placeholder="请选择或输入部门">
          <el-option v-for="i in options.department" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="任职单位" prop="organ">
        <el-select v-model="form.organ" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位">
          <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
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
import { curd } from '@/api/index'
import { mixin } from '@/common/mixin/post'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'PostUpdate',
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
      resource: 'post'
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
          if (this.form.endDay === '') {
            const d = new Date('2100-01-01')
            this.form.endDay = d
          }
          curd('update', this.form, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
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
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
</script>

<style></style>
