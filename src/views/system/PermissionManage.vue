<!--
 * @Author: truxcoder
 * @Date: 2021-12-16 09:33:48
 * @LastEditTime: 2021-12-20 17:04:46
 * @LastEditors: truxcoder
 * @Description: 添加权限
-->
<template>
  <el-dialog v-loading="dialogLoading" title="添加角色信息" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="manageForm" :inline="true" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="模块" prop="obj">
        <el-select v-model="form.obj" multiple placeholder="请选择模块">
          <el-option v-for="(item, index) in options.module" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="sub">
        <el-select v-model="form.sub" multiple placeholder="请选择角色">
          <el-option v-for="(item, index) in options.role" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限" prop="act">
        <el-select v-model="form.act" multiple placeholder="请选择权限">
          <el-option v-for="(item, index) in options.permission" :key="index" :label="item.label" :value="item.value" />
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
import { permissionManage, permissionAdd } from '@/api/permission'
import { arrayPermute, arrSubtraction } from '@/utils/permission'
export default {
  name: 'PermissionManage',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    passed: {
      type: Object,
      default() {
        return {}
      }
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { sub: [], obj: [], act: [] },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      loading: false,
      dialogLoading: false,
      rules: {
        sub: [{ required: true, message: '请选择角色', trigger: 'change' }],
        obj: [{ required: true, message: '请选择模块', trigger: 'change' }],
        act: [{ required: true, message: '请选择权限', trigger: 'change' }]
      }
    }
  },
  computed: {
    /**
     * @description: 根据用户选择生成权限列表
     */
    selected() {
      return arrayPermute([this.form.sub, this.form.obj, this.form.act])
    },
    originData() {
      if (Object.keys(this.passed).length) {
        if (this.visible === true) {
          return { sub: [this.passed.roleName], obj: [this.passed.moduleName], act: this.passed.permissionName.split(',') }
        } else {
          return { sub: [], obj: [], act: [] }
        }
      } else {
        return { sub: [], obj: [], act: [] }
      }
    },
    /**
     * @description: 根据父组件传过来的值生成原始权限列表
     */
    originArray() {
      return arrayPermute([this.originData.sub, this.originData.obj, this.originData.act])
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (Object.keys(this.passed).length) {
        if (val === true) {
          this.form = { sub: [this.passed.roleName], obj: [this.passed.moduleName], act: this.passed.permissionName.split(',') }
        } else {
          this.form = { sub: [], obj: [], act: [] }
        }
      } else {
        this.form = { sub: [], obj: [], act: [] }
      }
    }
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      this.$refs.manageForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          if (this.isUpdate) {
            const params = { add: false, del: false }
            const deled = arrSubtraction(this.originArray, this.selected)
            const added = arrSubtraction(this.selected, this.originArray)
            const data = { add: added, del: deled }
            this.dialogLoading = false
            if (deled.length > 0) {
              params.del = true
            }
            if (added.length > 0) {
              params.add = true
            }
            permissionManage(data, params)
              .then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogLoading = false
                this.$emit('manageSuccess')
                this.$refs.manageForm.resetFields()
              })
              .catch(err => {
                console.log(err)
                this.dialogLoading = false
              })
          } else {
            permissionAdd(this.selected)
              .then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogLoading = false
                this.$emit('manageSuccess')
                this.$refs.manageForm.resetFields()
              })
              .catch(err => {
                console.log(err)
                this.dialogLoading = false
              })
          }
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
      this.$emit('manageVisibleChange')
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.$refs.manageForm.resetFields()
    },

    /**
     * 获取原始传入数据和用户选择数据的差异，根据差异选择提交后的操作add or delete
     * @param {array} origin
     * @param {array} current
     * @return {array}
     */
    getDiff(origin, current) {}
  }
}
</script>

<style></style>
