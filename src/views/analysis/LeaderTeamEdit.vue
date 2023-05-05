<!--
 * @Author: truxcoder
 * @Date: 2022-03-02 20:29:43
 * @LastEditTime: 2023-04-13 13:42:08
 * @LastEditors: truxcoder
 * @Description: 班子成员添加编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" :title="actName + '班子成员'" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
        <PersonnelOption v-if="!isSingle" v-model="form.personnelId" :rowdata="row" :is-update="action === 'update'" :form-item-width="formItemWidth" />
      </el-form-item>

      <el-form-item label="所属班子" prop="organId">
        <el-select v-model="form.organId" :style="formItemWidth" filterable placeholder="请选择或输入单位">
          <el-option v-for="i in op.organ" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="所任职务" prop="positionId">
        <el-select v-model="form.positionId" :style="formItemWidth" filterable placeholder="请选择职务">
          <el-option v-for="i in op.position" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否为一把手" prop="isBoss">
        <el-select v-model="form.isBoss" :style="formItemWidth" placeholder="请选择是或否">
          <el-option v-for="i in op.yesOrNo" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否为正职" prop="isChief">
        <el-select v-model="form.isChief" :style="formItemWidth" placeholder="请选择是或否">
          <el-option v-for="i in op.yesOrNo" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="form.sort" :style="formItemWidth" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :style="formTextAreaWidth" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" placeholder="输入备注" />
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
import rules from '@/common/rules/leader_team'

export default {
  name: 'LeaderTeamEdit',
  components: { PersonnelOption },
  mixins: [edit_mixin],
  data() {
    return {
      resource: 'leader',
      form: { personnelId: '', organId: '', positionId: '', isBoss: '', isChief: '', sort: '', remark: '' },
      rules
    }
  },
  computed: {
    organMap() {
      const newMap = {}
      this.$store.getters.organs.forEach(item => (newMap[item.busOrgCode] = item))
      return newMap
    },
    op() {
      const positionOptions = this.remotePositionList.map(item => {
        return { label: item.name + ' 〔' + item.levelName + '〕', value: item.id }
      })
      const yesOrNo = [
        { label: '是', value: 2 },
        { label: '否', value: 1 }
      ]
      return {
        organ: this.$store.getters.organs,
        position: positionOptions,
        yesOrNo
      }
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
        this.form = { personnelId: '', organId: '', positionId: '', isBoss: '', isChief: '', sort: '', remark: '' }
        this.$refs.editForm.resetFields()
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
      const promises = [request('position', 'list')]
      Promise.all(promises).then(responses => {
        this.remotePositionList = responses[0].data
      })
    },
    onSubmit() {
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
    }
  }
}
</script>

<style></style>
