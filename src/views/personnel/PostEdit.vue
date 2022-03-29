<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2022-03-29 15:23:07
 * @LastEditors: truxcoder
 * @Description: 考核信息添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '任职信息'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item label="姓名" prop="personnelId">
        <el-input v-if="isSingle" :style="formItemWidth" :value="singlePersonnelData.name" disabled />
        <personnel-option v-if="!isSingle" :rowdata="row" :is-update="action === 'update'" :form-item-width="formItemWidth" @personnelChange="onPersonnelChange" />
      </el-form-item>
      <el-form-item label="任职部门" prop="department">
        <el-select v-model="form.department" :style="formItemWidth" filterable allow-create placeholder="请选择或输入部门">
          <el-option v-for="i in op.department" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="任职单位" prop="organ">
        <el-select v-model="form.organ" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位">
          <el-option v-for="i in op.organ" :key="i.id" :label="i.name" :value="i.name" />
        </el-select>
      </el-form-item>

      <el-form-item label="所任职务" prop="positionId">
        <el-select v-model="form.positionId" :style="formItemWidth" filterable placeholder="请选择职务">
          <el-option v-for="i in op.position" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="所任级别" prop="levelId">
        <el-select v-model="form.levelId" :style="formItemWidth" filterable disabled placeholder="请选择级别">
          <el-option v-for="i in op.level" :key="i.vaule" :label="i.label" :value="i.value" />
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
import { request, curd } from '@/api/index'
import { edit_mixin } from '@/common/mixin/edit'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import rules from '@/common/rules/post'
import { setDateFieldNull, setDateFieldZero } from '@/utils/date'

export default {
  name: 'PostEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'post',
      form: { personnelId: '', department: '', organ: '', startDay: '', endDay: '', positionId: '', levelId: '' },
      rules
    }
  },
  computed: {
    position() {
      return this.form.positionId
    },
    positionMap() {
      const map = new Map()
      this.remotePositionList.forEach(item => map.set(item.id, item))
      return map
    },
    organMap() {
      const newMap = {}
      this.$store.getters.organs.forEach(item => (newMap[item.busOrgCode] = item))
      return newMap
    },
    modelDateKeys() {
      return ['endDay']
    },
    op() {
      const positionOptions = this.remotePositionList.map(item => {
        return { label: item.name + ' 〔' + item.levelName + '〕', value: item.id }
      })
      const levelOptions = this.remoteLevelList.map(item => {
        return { label: item.name, value: item.id }
      })
      // const departmentOptions = this.$store.getters.departments.map(item => {
      //   const parent = this.organMap[item.busOrgCode] ? this.organMap[item.busOrgCode].name : ' '
      //   return { label: item.name + ' 〔' + parent + '〕', value: item.name }
      // })
      // .concat(
      //   oldDepartmentDict.map(item => {
      //     return { label: item, value: item }
      //   })
      // )
      // const departmentOptions = Array.from(new Set(this.$store.getters.departments.map(item => item.name).concat(oldDepartmentDict))).map(item => {
      //   return { label: item, value: item }
      // })
      const departmentOptions = this.$store.getters.departmentNames.map(item => {
        return { label: item, value: item }
      })

      return {
        department: departmentOptions,
        organ: this.$store.getters.organs,
        position: positionOptions,
        level: levelOptions
      }
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.form.personnelId = this.singlePersonnelData?.id ?? ''
        if (this.action === 'update') {
          for (const key in this.form) {
            this.form[key] = this.row[key]
            setDateFieldNull(this.form, this.modelDateKeys)
          }
          this.form.id = this.row.id
        }
      } else {
        this.form = { personnelId: '', department: '', organ: '', startDay: '', endDay: '', positionId: '', levelId: '' }
        this.$refs.editForm.resetFields()
      }
    },
    position: function(val, oldval) {
      if (val) {
        const levelId = this.positionMap.get(val)?.levelId
        this.$set(this.form, 'levelId', levelId)
      }
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.fetchAllData()
  },
  methods: {
    fetchAllData() {
      const promises = [request('position', 'list'), request('level', 'list')]
      Promise.all(promises).then(responses => {
        this.remotePositionList = responses[0].data
        this.remoteLevelList = responses[1].data
      })
    },
    onSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          setDateFieldZero(this.form, this.modelDateKeys)
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
    }
  }
}
</script>

<style></style>
