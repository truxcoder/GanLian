<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-05-18 11:11:55
 * @LastEditors: truxcoder
 * @Description: 模块信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '模块信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

    <el-form
      v-if="visible"
      ref="editForm"
      :inline="true"
      class="add-form"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" :style="formItemWidth" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="标签" prop="name">
        <el-input v-model="form.name" :style="formItemWidth" placeholder="请输入标签" />
      </el-form-item>
      <el-form-item label="菜单级别" prop="rank">
        <el-select v-model="form.rank" :style="formItemWidth" placeholder="请选择菜单级别">
          <el-option v-for="i in rankList" :key="i.label" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" :style="formItemWidth" placeholder="请输入路径" />
      </el-form-item>
      <el-form-item label="路由参数" prop="param">
        <el-input v-model="form.param" :style="formItemWidth" placeholder="请输入路由参数" />
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="form.component" :style="formItemWidth" placeholder="请输入组件名称" />
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="form.redirect" :style="formItemWidth" placeholder="请输入重定向路径" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <IconPicker v-model="form.icon" :width="formItemWidth.width" />
      </el-form-item>
      <el-form-item label="父模块" prop="parent">
        <el-select v-model="form.parent" :style="formItemWidth" placeholder="请选择父模块">
          <el-option v-for="i in newModuleList" :key="i.id" :label="i.title" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model.number="form.order" :style="formItemWidth" placeholder="请输入序号" />
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
import { edit_mixin } from '@/common/mixin/edit'
import rules from '@/common/rules/module'
import { iconList } from '@/utils/icon'
import IconPicker from '@/components/SvgIcon/IconPicker.vue'
export default {
  name: 'ModuleEdit',
  components: { IconPicker },
  mixins: [edit_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moduleList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      resource: 'module',
      form: { title: '', name: '', rank: '', path: '', param: '', component: '', redirect: '', icon: '', parent: '', order: '' },
      rules,
      dialogWidth: '1200px',
      formItemWidth: { width: '400px' },
      rankList: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 }
      ]
    }
  },
  computed: {
    iconList() {
      return iconList
    },
    newModuleList() {
      return [{ id: '0', title: '网站根模块' }, ...this.moduleList]
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { title: '', name: '', rank: '', path: '', param: '', component: '', redirect: '', icon: '', parent: '', order: '' }
        this.$refs.editForm.resetFields()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          if ((this.form.parent === '0' && this.form.rank !== 1) || (this.form.parent !== '0' && this.form.rank === 1)) {
            this.$message.error('模块级别和父组件不匹配！')
            this.dialogLoading = false
            return false
          }
          curd(this.action, this.form, { resource: this.resource })
            .then(response => {
              this.$message.success(response.message)
              this.dialogLoading = false
              this.$emit('editSuccess')
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
    querySearch(queryString, cb) {
      const results = queryString ? this.iconList.filter(this.createFilter(queryString)) : this.iconList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return item => item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style></style>
