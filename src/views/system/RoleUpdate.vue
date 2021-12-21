<template>
  <el-dialog v-loading="dialogLoading" title="编辑角色信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="updateForm" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="姓名" prop="personnelId">
        <personnel-option :rowdata="personnelOption" :is-update="true" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" :style="formItemWidth" placeholder="请选择角色">
          <el-option v-for="i in options" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { roleUpdate } from '@/api/role'
import { mixin } from '@/common/mixin/role'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
export default {
  name: 'RoleUpdate',
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
      testData: this.rowdata
    }
  },
  computed: {
    personnelOption() {
      return { personnelId: this.rowdata.id, personnelName: this.rowdata.name, role: this.rowdata.role, policeCode: this.rowdata.policeCode }
    }
  },
  watch: {
    // rowdata: function(val, oldval) {
    //   // 因为Vue中父向子传值，数组和对象会传引用。直接修改props里面的值会直接影响父组件数据。Vue官方推荐用计算属性。
    //   // 这里想办法建立一个本地属性。用Json方法生生造了一个对象。
    //   // 重构：用spread语法
    //   // this.form = JSON.parse(JSON.stringify(val))
    //   this.form = { ...val }
    // }
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.rowdata.id
        this.form.role = this.rowdata.role
      } else {
        this.form = { personnelId: '', role: '' }
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const data = {
            old: [this.rowdata.id, this.rowdata.role],
            new: [this.form.personnelId, this.form.role]
          }
          roleUpdate(data)
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.personnelOpitons = []
              this.$emit('updateSuccess', this.form)
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
      this.personnelOpitons = []
      this.$emit('updateVisibleChange')
      this.$refs.updateForm.resetFields()
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
</script>

<style></style>
