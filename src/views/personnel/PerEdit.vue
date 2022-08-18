<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-07-28 11:26:54
 * @LastEditors: truxcoder
 * @Description: 考核信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '人员信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item v-for="item in formItemData" :key="item" :label="models[item].label" :prop="item">
        <el-select
          v-if="models[item].type == 'SELECT'"
          v-model.trim="form[item]"
          :style="models[item].style"
          :multiple="models[item].multiple === true"
          :filterable="models[item].multiple === true"
          :allow-create="models[item].multiple === true"
          :placeholder="'请选择' + models[item].label"
        >
          <el-option v-for="i in models[item].options" :key="i" :label="i" :value="i" />
        </el-select>

        <el-select
          v-else-if="item === 'passport'"
          v-model.trim="form[item]"
          :style="models[item].style"
          :multiple="models[item].multiple === true"
          :filterable="models[item].multiple === true"
          :allow-create="models[item].multiple === true"
          :placeholder="'请选择' + models[item].label"
        >
          <el-option v-for="(i, k) in models[item].options" :key="k" :disabled="!isPassportOptionValid(i.value)" :label="i.label" :value="i.value" />
        </el-select>
        <el-select
          v-else-if="models[item].type == 'SELECT2'"
          v-model.trim="form[item]"
          :style="models[item].style"
          :multiple="models[item].multiple === true"
          :filterable="models[item].filterable === true"
          :allow-create="models[item].create === true"
          :clearable="models[item].clearable === true"
          :placeholder="'请选择' + models[item].label"
        >
          <el-option v-for="(i, k) in models[item].options ? models[item].options : formOptions[item] " :key="k" :label="i.label" :value="i.value" />
        </el-select>

        <el-autocomplete
          v-else-if="models[item].type == 'AUTOCOMPLETE'"
          v-model.trim="form[item]"
          :style="models[item].style"
          class="inline-input"
          :fetch-suggestions="models[item].suggestion"
          placeholder="请输入内容"
        />

        <el-date-picker v-else-if="models[item].type === 'DATE' || models[item].type === 'MONTH'" v-model="form[item]" :style="models[item].style" :picker-options="pickerOptions" :type="models[item].type === 'MONTH' ? 'month' : 'date'" placeholder="选择日期" />
        <el-input v-else-if="models[item].type == 'NUMBER'" v-model.number="form[item]" :style="models[item].style" autocomplete="off" />
        <el-input
          v-else-if="item === 'remark'"
          v-model="form[item]"
          :style="models[item].style"
          :disabled="isNormal"
          :placeholder="'请输入' + models[item].label"
        />
        <el-input
          v-else-if="models[item].type == 'TEXT'"
          v-model="form[item]"
          :style="models[item].style"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="'请输入' + models[item].label"
        />
        <el-input v-else v-model.trim="form[item]" :disabled="models[item].disabled" :style="models[item].style" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request, curd } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import rules from '@/common/rules/personnel'
import models from '@/common/model/personnel'
import { setDateFieldNull } from '@/utils/date'
import { isNormalRole } from '@/utils/permission'
export default {
  name: 'PersonnelEdit',
  mixins: [edit_mixin],
  props: {
    organList: {
      type: Array,
      default() {
        return []
      }
    },
    isParentList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resource: 'personnel',
      originForm: {},
      form: {},
      rules,
      models,
      formOptions: {},
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  computed: {
    formItemData() {
      return Object.keys(models).sort((a, b) => models[a].order - models[b].order)
    },
    modelKeys() {
      return Object.entries(this.models)
        .filter(item => !item[1]?.disabled)
        .map(item => item[0])
    },
    modelDateKeys() {
      return Object.entries(this.models)
        .filter(item => !item[1]?.disabled && (item[1]?.type === 'DATE' || item[1]?.type === 'MONTH'))
        .map(item => item[0])
    },
    isNormal() {
      return isNormalRole(this.$store.getters.roles)
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        // this.form.personnelId = this.singlePersonnelData?.id ?? ''
        if (this.action === 'update') {
          if (this.isParentList) {
            this.dialogLoading = true
            request('personnel', 'detail', { id: this.row.id }).then(response => {
              // this.form = response.data ?? {}
              this.formItemData.forEach(item => {
                this.originForm[item] = response.data[item]
              })
              this.originForm.id = this.row.id
              this.form = { ...this.originForm }
              this.form.proCert = this.form.proCert ? this.form.proCert.split(',') : []
              this.form.passport = this.form.passport ? JSON.parse(this.form.passport) : []
              setDateFieldNull(this.form, this.modelDateKeys)
              setDateFieldNull(this.originForm, this.modelDateKeys)
              this.dialogLoading = false
            })
          } else {
            // this.form = { ...this.row }
            this.formItemData.forEach(item => {
              this.originForm[item] = this.row[item]
            })
            this.originForm.id = this.row.id
            this.form = { ...this.originForm }
            this.form.proCert = this.form.proCert ? this.form.proCert.split(',') : []
            this.form.passport = this.form.passport ? JSON.parse(this.form.passport) : []
            // const firstDay = new Date('0001-01-01T00:00:01Z')
            // this.modelDateKeys.forEach(item => {
            //   this.form[item] = dayjs(this.form[item]).year() !== 1 ? this.form[item] : null
            // })
            setDateFieldNull(this.form, this.modelDateKeys)
            setDateFieldNull(this.originForm, this.modelDateKeys)
          }
        }
      } else {
        this.originForm = {}
        this.form = {}
        this.$refs.editForm.resetFields()
      }
    }
  },
  created() {
    request('personnel', 'dict').then(res => {
      this.formOptions.fullTimeEdu = res.data
        ? res.data.filter(item => item.category === 1).map(item => ({ label: item.name, value: item.name }))
        : []
      this.formOptions.partTimeEdu = res.data
        ? res.data.filter(item => item.category === 2).map(item => ({ label: item.name, value: item.name }))
        : []
      this.formOptions.finalEdu = res.data ? Array.from(new Set(res.data.map(i => i.name))).map(item => ({ label: item, value: item })) : []
    })
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          // let isNormal = false
          // try {
          //   isNormal = isNormalRole(this.$store.getters.roles)
          // } catch (error) {
          //   this.$message.error(error)
          //   this.dialogLoading = false
          //   return false
          // }

          this.form.proCert = this.form.proCert.toString()
          this.form.passport = this.form.passport.length ? JSON.stringify(this.form.passport) : JSON.stringify([0])
          // const firstDay = new Date('0001-01-01T00:00:01Z')
          // this.modelDateKeys.forEach(item => {
          //   this.form[item] = this.form[item] ?? firstDay
          // })
          // setDateFieldZero(this.form, this.modelDateKeys)
          const content = this.getDiffData()
          if (Object.keys(content).length === 0) {
            this.$message.info('未修改任何数据')
            this.dialogLoading = false
            this.$emit('visibleChange', 'edit')
            return false
          }
          if (!this.can?.manage) {
            const data = {
              personnelId: this.form.id,
              organId: this.$store.getters.organ,
              category: 1,
              // content: JSON.stringify(this.form)
              content: JSON.stringify(content)
            }
            request('pre', null, data)
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
          }
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    isPassportOptionValid(v) {
      const values = this.form.passport ?? []
      if (v === 0 && values.length > 0 && values.includes(0)) {
        return true
      }
      if (v === 0 && values.length > 0 && !values.includes(0)) {
        return false
      }
      if (v !== 0 && values.includes(0)) {
        return false
      }
      return true
    },
    getDiffData() {
      const temp = {}
      for (const i in this.form) {
        if (this.form[i] !== this.originForm[i]) {
          temp[i] = this.form[i]
        }
      }
      return temp
    },
    onCleanSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style></style>
