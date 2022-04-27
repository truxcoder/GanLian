<!--
 * @Author: truxcoder
 * @Date: 2022-02-28 11:24:30
 * @LastEditTime: 2022-04-01 14:50:01
 * @LastEditors: truxcoder
 * @Description: 添加修改各类事项信息
 * wangEditor使用说明:
 * 设置内容: 初始化直接将内容写到要创建编辑器的 <div> 标签中,创建编辑器之后，使用 editor.txt.html(...) 设置编辑器内容。
 * eg: editor.txt.html('<p>用 JS 设置的内容</p>')
 * 获取html: editor.txt.html(), 获取text:editor.txt.text()
 * 清空内容: editor.txt.clear()
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="dialogTitle" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form
      v-if="visible"
      ref="editForm"
      class="add-form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="medium"
      :label-width="formLabelWidth"
      label-position="right"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <PersonnelOption v-if="!isSingle" v-model="form.personnelId" :rowdata="row" :is-update="action === 'update'" :form-item-width="formItemWidth" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" :style="formItemWidth" :disabled="category > 0" placeholder="请选择分类">
          <el-option v-for="i in categoryOption" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="事件简介" prop="intro" />
    </el-form>
    <div id="editor" class="pl-16" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { curd, request } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import rules from '@/common/rules/affair'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import { affairCategoryDict } from '@/utils/dict'
import E from 'wangeditor'
export default {
  name: 'AffairEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  props: {
    category: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resource: 'affair',
      editor: null,
      form: { title: '', personnelId: '', category: '', intro: '' },
      formItemWidth: { width: '280px' },
      formLineWidth: { width: '710px' },
      rules
    }
  },
  computed: {
    categoryName() {
      return this.category ? affairCategoryDict[this.category] : '监督事项'
    },
    dialogTitle() {
      return this.actName + this.categoryName
    },
    categoryOption() {
      const dict = [...affairCategoryDict]
      dict.shift()
      return dict.map((v, i) => ({ label: v, value: i + 1 }))
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData?.id ?? ''
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
          }
          this.form.id = this.row.id
          this.fetchData()
        } else {
          if (this.editor) {
            this.setIntro()
          } else {
            // 需要等页面DOM渲染完毕之后才能初始化编辑器，所以这里用了nextTick
            this.$nextTick(() => this.initEditor())
          }
          this.form.category = this.category || ''
        }
      } else {
        this.form = { title: '', personnelId: '', category: '', intro: '' }
        this.$refs.editForm.resetFields()
        this.editor.txt.clear()
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    this.disposeEditor
  },
  methods: {
    fetchData() {
      this.dialogLoading = true
      request(this.resource, 'one', { id: this.row.id }).then(response => {
        this.form.intro = response.data?.intro ?? ''
        this.editor ? this.setIntro() : this.initEditor()
        this.dialogLoading = false
      })
    },
    onSubmit() {
      this.form.intro = this.editor.txt.html()
      // if (this.category) {
      //   this.form.category = this.category
      // }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          console.log('this.form:', this.form)
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
    initEditor() {
      // 创建编辑器
      this.editor = new E(`#editor`)
      // 默认情况下，显示所有菜单
      this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        // 'fontName',
        'italic',
        'underline',
        // 'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        // 'backColor',
        // 'link',
        'list',
        // 'todo',
        'justify',
        'quote',
        // 'emoticon',
        // 'image',
        // 'video',
        // 'table',
        // 'code',
        // 'splitLine',
        'undo',
        'redo'
      ]
      this.editor.create()
      this.setIntro()
    },
    disposeEditor() {
      // 销毁编辑器
      this.editor && this.editor.destroy()
      this.editor = null
    },
    setIntro() {
      this.form.intro && this.editor.txt.html(this.form.intro)
    }
  }
}
</script>

<style></style>
