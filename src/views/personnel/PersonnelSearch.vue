<template>
  <el-drawer title="人员信息高级检索" :visible.sync="visible" :size="900" :wrapper-closable="false" :show-close="false">
    <el-form v-if="visible" ref="searchForm" v-loading="loading" :inline="true" class="add-form" :model="form" :rules="rules" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item label="年龄">
        <el-input v-model.number="form.ageStart" :style="itemShortWidth">
          <template slot="append">岁</template>
        </el-input>
        <span> - </span>
        <el-input v-model.number="form.ageEnd" :style="itemShortWidth">
          <template slot="append">岁</template>
        </el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="form.gender" label="男">男</el-radio>
        <el-radio v-model="form.gender" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="民族" prop="nation">
        <el-select v-model="form.nation" :style="formItemWidth" multiple>
          <el-option v-for="i in nationOption" :key="i" :label="i" :value="i" />
        </el-select>
        <!-- <el-autocomplete v-model="form.nation" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.queryNation" placeholder="请输入内容" @select="handleSelect" /> -->
      </el-form-item>
      <el-form-item label="政治面貌" prop="political">
        <el-select v-model="form.political" :style="formItemWidth" multiple>
          <el-option v-for="i in politicalOption" :key="i" :label="i" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="全日制教育学历" prop="fullTimeEdu">
        <el-select v-model="form.fullTimeEdu" :style="formItemWidth" multiple>
          <el-option v-for="i in fullTimeEduOption" :key="i" :label="i" :value="i" />
        </el-select>
        <!-- <el-autocomplete v-model="form.fullTimeEdu" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.queryFullTimeEdu" placeholder="请输入内容" @select="handleSelect" /> -->
      </el-form-item>
      <el-form-item label="全日制教育专业" prop="fullTimeMajor">
        <el-select v-model="form.fullTimeMajor" :style="formItemWidth" filterable allow-create multiple :filter-method="subjectFilter">
          <el-option v-for="i in subjectOption" :key="i" :label="i" :value="i" />
        </el-select>
        <!-- <el-autocomplete v-model="form.fullTimeMajor" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.querySubject" placeholder="请输入内容" @select="handleSelect" /> -->
      </el-form-item>
      <el-form-item label="非全日制教育学历" prop="partTimeEdu">
        <el-select v-model="form.partTimeEdu" :style="formItemWidth" multiple>
          <el-option v-for="i in partTimeEduOption" :key="i" :label="i" :value="i" />
        </el-select>
        <!-- <el-autocomplete v-model="form.partTimeEdu" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.queryPartTimeEdu" placeholder="请输入内容" @select="handleSelect" /> -->
      </el-form-item>
      <el-form-item v-if="can.global" label="所属单位" prop="organId">
        <el-select v-model="form.organId" :style="formItemWidth" placeholder="请选择单位">
          <el-option v-for="i in organOption" :key="i.id" :label="i.name" :value="i.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="岗位是否涉密" prop="isSecret">
        <el-radio v-model="form.isSecret" label="是">是</el-radio>
        <el-radio v-model="form.isSecret" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="考核是否存在称职以下等次" :label-width="formLabelLongWidth" prop="hasAppraisalIncompetent">
        <el-radio v-model="form.hasAppraisalIncompetent" label="是">是</el-radio>
        <el-radio v-model="form.hasAppraisalIncompetent" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="是否持有护照" prop="hasPassport">
        <el-radio v-model="form.hasPassport" label="是">是</el-radio>
        <el-radio v-model="form.hasPassport" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="县处级任职考试通过且有效" :label-width="formLabelLongWidth" prop="passExamDay">
        <el-radio v-model="form.passExamDay" label="是">是</el-radio>
        <el-radio v-model="form.passExamDay" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="取得专业证书情况" prop="proCert">
        <el-select v-model="form.proCert" :style="itemLineWidth" multiple filterable allow-create>
          <el-option v-for="i in proCertOption" :key="i" :label="i" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织奖励" prop="award">
        <el-select v-model="form.award" :style="itemLineWidth" multiple>
          <el-option v-for="i in awardOption" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织处理" prop="punish">
        <el-select v-model="form.punish" :style="itemLineWidth" multiple>
          <el-option v-for="i in punishOption" :key="i.vaule" :label="i.label" :value="i.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer pl-4">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="success" plain @click="resetFields">重 置</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-drawer>
</template>

<script>
var lang = require('lodash/lang')
import { suggestions } from '@/common/model/suggestions'
import { nationDict, politicalDict, proCertDict, fullTimeEduDict, partTimeEduDict, awardGrade, punishGrade } from '@/utils/dict'
import { subjectDict } from '@/utils/subject_dict'
export default {
  name: 'PersonnelSearch',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    can: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      suggestions,
      form: {
        ageStart: '',
        ageEnd: '',
        gender: '',
        nation: [],
        political: [],
        fullTimeEdu: [],
        fullTimeMajor: [],
        partTimeEdu: [],
        organId: '',
        proCert: [],
        isSecret: '',
        hasPassport: '',
        passExamDay: '',
        hasAppraisalIncompetent: '',
        award: [],
        punish: []
      },
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLabelLongWidth: '280px',
      formItemWidth: { width: '240px' },
      itemShortWidth: { width: '112px' },
      itemLongWidth: { width: '400px' },
      itemLineWidth: { width: '640px' },
      formTextAreaWidth: { width: '940px' },
      rules: {},
      loading: false,
      genderOption: ['男', '女'],
      YesOrNo: ['是', '否'],
      subjectOption: [],
      // nationOption: nationDict,
      politicalOption: politicalDict,
      proCertOption: proCertDict,
      fullTimeEduOption: fullTimeEduDict,
      partTimeEduOption: partTimeEduDict,
      fullTimeMajorOption: subjectDict,
      awardOption: awardGrade,
      punishOption: punishGrade,
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
    organOption() {
      return this.$store.getters.organs
    },
    nationOption() {
      nationDict.splice(1, 0, '少数民族')
      return nationDict
    }
  },
  methods: {
    onSubmit() {
      if (this.allNullCheck(this.form)) {
        if (!this.validate(this.form)) {
          this.$message.error('查询数据不合法!')
          return false
        }
        const temp = lang.cloneDeep(this.form)
        if (temp?.ageStart === '') {
          temp.ageStart = 0
        }
        if (temp?.ageEnd === '') {
          temp.ageEnd = 0
        }
        console.log('temp:', temp)
        this.$emit('advanceSearch', temp)
        // this.resetFields()
      }
      // this.form.forEach(item => {
      //   if (Array.isArray(item) && item.length >0) {
      //     isValid = true
      //     return
      //   } else if (Object.prototype.toString.call(item) === '[object String]') {

      //   }
      // })
      // this.$refs.searchForm.validate(valid => {
      //   if (valid) {
      //     this.dialogLoading = true
      //     console.log('this.form:', this.form)
      //     personnelSearch(this.form)
      //       .then(response => {
      //         this.$message({
      //           message: response.message,
      //           type: 'success'
      //         })
      //         this.dialogLoading = false
      //         this.$emit('addSuccess')
      //         this.resetFields()
      //         // Object.keys(this.form).forEach(key => this.form[key]='')
      //       })
      //       .catch(err => {
      //         // this.$message.error(err.message)
      //         console.log(err)
      //         this.dialogLoading = false
      //       })
      //   } else {
      //     this.$message.error('请按规则填写表格！')
      //     return false
      //   }
      // })
    },
    handleSelect(item) {
      console.log(item)
    },
    onCancel() {
      this.$emit('visibleChange', 'search')
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.resetFields()
    },
    resetFields() {
      this.form.ageStart = ''
      this.form.ageEnd = ''
      this.subjectOption = []
      this.$refs.searchForm.resetFields()
      for (const k of Object.keys(this.form)) {
        switch (Object.prototype.toString.call(this.form[k])) {
          case '[object Array]':
            this.form[k] = []
            break
          default:
            this.form[k] = ''
            break
        }
      }
    },
    /**
     * @description: 检查是否所有字段都为空
     * @param {object} form
     * @return {Boolean} 布尔值
     */
    allNullCheck(form) {
      let isValid = false
      for (const k of Object.keys(form)) {
        if (Object.prototype.toString.call(form[k]) === '[object String]') {
          form[k] = form[k].trim()
        }
      }
      for (const v of Object.values(form)) {
        if (Array.isArray(v) && v.length > 0) {
          isValid = true
          break
        } else if (Object.prototype.toString.call(v) === '[object String]' && v !== '') {
          isValid = true
          break
        } else if (Object.prototype.toString.call(v) === '[object Number]' && v !== 0) {
          isValid = true
          break
        }
      }
      if (!isValid) {
        this.$message.error('查询字段不能全为空!')
      }
      return isValid
    },
    /**
     * @description: 表单合法性检查
     * @param {*} form
     * @return {*}
     */
    validate(form) {
      if ((form.ageStart !== '' && Object.prototype.toString.call(form.ageStart) !== '[object Number]') || (form.ageEnd !== '' && Object.prototype.toString.call(form.ageEnd) !== '[object Number]')) {
        return false
      }
      return true
    },
    subjectFilter(sub) {
      if (sub !== '') {
        this.subjectOption = subjectDict.filter(item => item.includes(sub))
        return
      } else if (this.form.fullTimeMajor.length === 0) {
        this.subjectOption = []
      }
    }
  }
}
</script>

<style></style>
