<template>
  <el-drawer title="人员信息高级检索" :visible.sync="visible" :size="1250" :wrapper-closable="false" :show-close="false">
    <div class="search-container px-8 mb-4">
      <el-form
        v-if="visible"
        ref="searchForm"
        v-loading="loading"
        :inline="true"
        class="add-form"
        :model="form"
        :rules="rules"
        size="medium"
        :label-width="labelWidth"
        label-position="right"
      >
        <el-collapse v-model="activePanel" accordion>
          <el-collapse-item title="人员基础信息" name="1">
            <el-form-item label="年龄">
              <el-input v-model.number="form.ageStart" :style="miniWidth">
                <template slot="append">岁</template>
              </el-input>
              <span> - </span>
              <el-input v-model.number="form.ageEnd" :style="miniWidth">
                <template slot="append">岁</template>
              </el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <!-- <el-radio v-model="form.gender" label="男">男</el-radio>
              <el-radio v-model="form.gender" label="女">女</el-radio> -->
              <el-select v-model="form.gender" :style="threeColumn">
                <el-option v-for="i in genderOption" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="政治面貌" prop="political">
              <el-select v-model="form.political" :style="threeColumn" multiple>
                <el-option v-for="i in politicalOption" :key="i" :label="i" :value="i" />
              </el-select>
            </el-form-item>

            <el-form-item label="所属单位" prop="organId">
              <el-select v-model="form.organId" :disabled="!can.global" :style="leftColumn" multiple placeholder="请选择单位">
                <el-option v-for="i in organOption" :key="i.id" :label="i.shortName" :value="i.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-select v-model="form.nation" :style="threeColumn" multiple>
                <el-option v-for="i in nationOption" :key="i" :label="i" :value="i" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否持有护照" prop="hasPassport">
              <!-- <el-radio v-model="form.hasPassport" label="是">是</el-radio>
              <el-radio v-model="form.hasPassport" label="否">否</el-radio> -->
              <el-select v-model="form.hasPassport" :style="threeColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="工龄">
              <el-input v-model.number="form.jobAgeStart" :style="miniWidth">
                <template slot="append">年</template>
              </el-input>
              <span> - </span>
              <el-input v-model.number="form.jobAgeEnd" :style="miniWidth">
                <template slot="append">年</template>
              </el-input>
            </el-form-item>
            <el-form-item label="岗位是否涉密" prop="isSecret">
              <!-- <el-radio v-model="form.isSecret" label="是">是</el-radio>
              <el-radio v-model="form.isSecret" label="否">否</el-radio> -->
              <el-select v-model="form.isSecret" :style="threeColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="健康状况" prop="health">
              <el-input v-model="form.health" :style="threeColumn" placeholder="请输入健康状况" />
            </el-form-item>

            <el-form-item label="全日制教育学历" prop="fullTimeEdu">
              <el-cascader v-model="form.fullTimeEdu" :style="leftColumn" :options="eduOptions" :show-all-levels="false" :props="cascaderProps" />
            <!-- <el-autocomplete v-model="form.fullTimeEdu" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.queryFullTimeEdu" placeholder="请输入内容" @select="handleSelect" /> -->
            </el-form-item>
            <el-form-item label="全日制教育学位" prop="fullTimeDegree">
              <el-cascader v-model="form.fullTimeDegree" :style="threeColumn" :options="degreeOptions" filterable :show-all-levels="false" :props="cascaderProps" />
            </el-form-item>
            <el-form-item label="全日制教育专业" prop="fullTimeMajor">
              <el-select v-model="form.fullTimeMajor" :style="threeColumn" filterable allow-create multiple :filter-method="subjectFilter" placeholder="请输入关键字">
                <el-option v-for="i in subjectOption" :key="i" :label="i" :value="i" />
              </el-select>
            <!-- <el-autocomplete v-model="form.fullTimeMajor" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.querySubject" placeholder="请输入内容" @select="handleSelect" /> -->
            </el-form-item>

            <el-form-item label="最高教育学历" prop="finalEdu">
              <el-cascader v-model="form.finalEdu" :style="leftColumn" :options="eduOptions" :show-all-levels="false" :props="cascaderProps" />
            <!-- <el-autocomplete v-model="form.fullTimeEdu" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.queryFullTimeEdu" placeholder="请输入内容" @select="handleSelect" /> -->
            </el-form-item>
            <el-form-item label="最高教育学位" prop="finalDegree">
              <el-cascader v-model="form.finalDegree" :style="threeColumn" :options="degreeOptions" filterable :show-all-levels="false" :props="cascaderProps" />
            </el-form-item>
            <el-form-item label="最高教育专业" prop="finalMajor">
              <el-select v-model="form.finalMajor" :style="threeColumn" filterable allow-create multiple :filter-method="subjectFilter" placeholder="请输入关键字">
                <el-option v-for="i in subjectOption" :key="i" :label="i" :value="i" />
              </el-select>
            <!-- <el-autocomplete v-model="form.fullTimeMajor" :style="formItemWidth" class="inline-input" :fetch-suggestions="suggestions.querySubject" placeholder="请输入内容" @select="handleSelect" /> -->
            </el-form-item>

            <el-form-item label="考核有称职以下等次" prop="hasAppraisalIncompetent">
              <!-- <el-radio v-model="form.hasAppraisalIncompetent" label="是">是</el-radio>
              <el-radio v-model="form.hasAppraisalIncompetent" label="否">否</el-radio> -->
              <el-select v-model="form.hasAppraisalIncompetent" :style="leftColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="组织奖励" prop="award">
              <el-select v-model="form.award" :style="threeColumn" multiple>
                <el-option v-for="i in awardOption" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="组织处理" prop="punish">
              <el-select v-model="form.punish" :style="threeColumn" multiple>
                <el-option v-for="i in punishOption" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="县处级考试通过" prop="passExamDay">
              <!-- <el-radio v-model="form.passExamDay" label="是">是</el-radio>
              <el-radio v-model="form.passExamDay" label="否">否</el-radio> -->
              <el-select v-model="form.passExamDay" :style="leftColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="取得专业证书情况" prop="proCert">
              <el-select v-model="form.proCert" :style="twoColumn" multiple filterable allow-create>
                <el-option v-for="i in proCertOption" :key="i" :label="i" :value="i" />
              </el-select>
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="干部任职信息" name="2">
            <el-form-item label="职务级别" prop="level">
              <el-select v-model="form.level" :style="leftColumn" size="small" placeholder="请选择级别" multiple>
                <el-option v-for="i in levels" :key="i.id" :label="i.name" :value="i.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="所任职务" prop="positionId">
              <el-select v-model="form.positionId" size="small" :style="threeColumn" filterable multiple placeholder="请选择职务">
                <el-option v-for="i in positionList" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="正职或副职" prop="isChief">
              <el-select v-model="form.isChief" :style="threeColumn">
                <el-option v-for="i in chiefOption" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="是否为领导职务" prop="isLeader">
              <el-select v-model="form.isLeader" :style="leftColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否为现任" prop="current">
              <el-select v-model="form.current" :style="threeColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="两个以上任职经历" prop="twoPost">
              <!-- <el-select v-model="form.twoPost" :style="threeColumn">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select> -->
              <el-cascader v-model="form.twoPost" :style="threeColumn" :options="twoPostOption" filterable :show-all-levels="false" :props="cascaderProps" />

            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="干部监督信息" name="3">
            <el-form-item label="配偶存在子女移居国外情况" :label-width="longLabel" prop="familyAbroad">
              <!-- <el-radio v-model="form.familyAbroad" label="是">是</el-radio>
              <el-radio v-model="form.familyAbroad" label="否">否</el-radio> -->
              <el-select v-model="form.familyAbroad" :style="longItem">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="信访举报待查实或已查属实" :label-width="longLabel" prop="hasReport">
              <!-- <el-radio v-model="form.hasReport" label="是">是</el-radio>
              <el-radio v-model="form.hasReport" label="否">否</el-radio> -->
              <el-select v-model="form.hasReport" :style="longItem">
                <el-option v-for="i in YesOrNo" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="快捷策略" name="4">
            <!-- <el-tooltip v-for="v in customs" :key="v.id" placement="top" effect="light">
              <div slot="content">
                <el-link type="primary" icon="el-icon-edit">编辑</el-link>
                <el-link type="primary" icon="el-icon-delete">删除</el-link>
              </div>
              <el-button size="small" type="success" :plain="selectedCustomId !== v.id" @click="onCustomSelect(v)">{{ v.name }}</el-button>
            </el-tooltip> -->
            <div v-if="!isCustomEdit" class=" leading-10">
              <el-button v-for="v in customs" :key="v.id" size="small" type="success" :plain="selectedCustomId !== v.id" @click="onCustomSelect(v)">{{ v.name }}</el-button>
              <el-button v-if="customs.length > 0" size="small" type="primary" @click="isCustomEdit = true">编辑查询标签</el-button>
            </div>
            <div v-if="isCustomEdit" class=" leading-10">
              <span v-for="v in customs" :key="v.id">
                <el-button-group class=" mx-4">
                  <el-button size="small" type="success">{{ v.name }}</el-button>
                  <el-button size="small" type="primary" icon="el-icon-edit" @click="onCustomRename(v)" />
                  <el-button size="small" type="danger" icon="el-icon-delete" @click="onCustomDelete(v)" />
                </el-button-group>
              </span>
              <span v-if="customs.length > 0">
                <div class=" inline-block align-middle">
                  <el-button size="small" type="primary" plain @click="isCustomEdit = false">取消或完成</el-button>
                </div>
              </span>
            </div>

          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>

    <div class="dialog-footer pl-4 mb-8">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" plain @click="resetFields">重 置</el-button>
      <el-button type="primary" plain @click="onSaveCustom">保存检索策略</el-button>
      <el-button type="success" @click="onSubmit">确 定</el-button>
    </div>
  </el-drawer>
</template>

<script>
var lang = require('lodash/lang')
import { isEmpty } from '@/utils/validate'
import { suggestions } from '@/common/model/suggestions'
import { nationDict, politicalDict, proCertDict, fullTimeEduDict, partTimeEduDict, awardGrade, punishGrade } from '@/utils/dict'
import { subjectDict } from '@/utils/subject_dict'
import { eduOptions, degreeOptions } from '@/utils/dict_edu'

import { request, curd } from '@/api/index'
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
    },
    levels: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      positionData: [],
      selectedCustomId: 0,
      isCustomEdit: false,
      activePanel: '1',
      suggestions,
      originForm: {
        ageStart: '',
        ageEnd: '',
        jobAgeStart: '',
        jobaAgeEnd: '',
        gender: '',
        health: '',
        nation: [],
        political: [],
        fullTimeEdu: [],
        fullTimeDegree: [],
        fullTimeMajor: [],
        finalEdu: [],
        finalDegree: [],
        finalMajor: [],
        organId: [],
        positionId: [],
        level: [],
        isChief: '',
        isLeader: '',
        current: '',
        twoPost: '',
        proCert: [],
        isSecret: '',
        hasPassport: '',
        passExamDay: '',
        hasAppraisalIncompetent: '',
        familyAbroad: '',
        hasReport: '',
        award: [],
        punish: []
      },
      form: {},
      dialogWidth: '1250px',
      labelWidth: '150px',
      longLabel: '230px',
      longItem: { width: '300px' },
      miniWidth: { width: '112px' },
      oneColumn: { width: '940px' },
      twoColumn: { width: '560px' },
      threeColumn: { width: '200px' },
      leftColumn: { width: '240px' },
      rules: {},
      loading: false,
      // genderOption: ['男', '女'],
      genderOption: [{ label: '男', value: '男' }, { label: '女', value: '女' }, { label: '不限', value: '' }],
      chiefOption: [{ label: '正职', value: '正职' }, { label: '副职', value: '副职' }, { label: '不限', value: '' }],
      YesOrNo: [{ label: '是', value: '是' }, { label: '否', value: '否' }, { label: '不限', value: '' }],
      // YesOrNo: ['是', '否'],
      subjectOption: [],
      // nationOption: nationDict,
      politicalOption: politicalDict,
      proCertOption: proCertDict,
      fullTimeEduOption: fullTimeEduDict,
      partTimeEduOption: partTimeEduDict,
      eduOptions: eduOptions,
      degreeOptions: degreeOptions,
      fullTimeMajorOption: subjectDict,
      awardOption: awardGrade,
      punishOption: punishGrade,
      cascaderProps: { expandTrigger: 'hover', emitPath: false, multiple: true },
      twoPostOption: [],
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
      const temp = [...nationDict]
      temp.splice(1, 0, '少数民族')
      return temp
    },
    customs() {
      return this.$store.getters.custom
    },
    positionList() {
      return this.positionData.map(item => {
        return { label: item.name + ' 〔' + item.levelName + '〕', value: item.id }
      })
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true && this.twoPostOption.length === 0) {
        this.twoPostOption = this.getTwoPostOption()
      }
    },
    'form.twoPost'(val, oldval) {
      if (val.includes('不限')) {
        this.twoPostOption[1].disabled = true
      } else if (Array.isArray(val) && val.length > 0 && !val.includes('不限')) {
        this.twoPostOption[0].disabled = true
      } else if (Array.isArray(val) && val.length === 0) {
        this.twoPostOption.forEach(i => {
          i.disabled = false
        })
      }
    }
  },
  created() {
    this.form = lang.cloneDeep(this.originForm)
    this.fetchOtherData()
  },
  methods: {
    fetchOtherData() {
      Promise.all([request('position', 'list')]).then(responses => {
        this.positionData = responses[0].data ?? []
      })
    },
    onSubmit() {
      if (this.allNullCheck(this.form)) {
        if (!this.validate(this.form)) {
          this.$message.error('查询数据不合法!')
          return false
        }
        const temp = this.parseFormData()
        // const temp = lang.cloneDeep(this.form)
        // if (temp?.ageStart === '') {
        //   temp.ageStart = 0
        // }
        // if (temp?.ageEnd === '') {
        //   temp.ageEnd = 0
        // }
        console.log('temp:', temp)
        this.$emit('advanceSearch', temp)
        // this.resetFields()
      }
    },
    onSaveCustom() {
      if (this.allNullCheck(this.form)) {
        if (!this.validate(this.form)) {
          this.$message.error('查询条件不合法, 无法保存!')
          return false
        }
        this.$prompt('请输入策略名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /\S+/,
          inputValidator: this.inputValidator,
          inputErrorMessage: '名称不能为空'
        }).then(({ value }) => {
          const data = { name: value, category: 1, accountId: this.$store.getters.id, content: JSON.stringify(this.parseFormData()) }
          curd('add', data, { resource: 'custom' }).then(response => {
            this.$message.success(response.message)
            this.dispatchCustomData()
          })
            .catch(err => this.$message.error(err))
        }).catch(() => {
          this.$message.info('取消输入')
        })
      }
    },
    onCustomSelect(v) {
      const content = JSON.parse(v.content)
      this.form = this.originForm
      Object.assign(this.form, content)
      this.selectedCustomId = v.id
    },
    onCustomRename(v) {
      this.$prompt('请重新输入策略名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /\S+/,
        inputValidator: this.inputValidator,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        const data = { id: v.id, name: value }
        curd('update', data, { resource: 'custom' }).then(response => {
          this.$message.success(response.message)
          this.dispatchCustomData()
        })
          .catch(err => this.$message.error(err))
      }).catch(() => {
        this.$message.info('取消输入')
      })
    },
    onCustomDelete(v) {
      this.$confirm('将删除该标签, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          curd('delete', { id: [v.id] }, { resource: 'custom' })
            .then(response => {
              this.$message.success(response.message)
              this.dispatchCustomData()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleSelect(item) {
      console.log(item)
    },
    onCancel() {
      this.$emit('visibleChange', 'search')
      this.activePanel = '1'
      // Object.keys(this.form).forEach(key => this.form[key]='')
      this.resetFields()
    },
    dispatchCustomData() {
      this.$store.dispatch('account/changeCustom', { category: 1, accountId: this.$store.getters.id })
    },
    resetFields() {
      this.form.ageStart = ''
      this.form.ageEnd = ''
      this.subjectOption = []
      this.$refs.searchForm.resetFields()
      this.selectedCustomId = 0
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
      if (sub === '' || sub === null || sub === undefined) {
        this.subjectOption = []
        return
      } else {
        this.subjectOption = subjectDict.filter(item => item.includes(sub))
      }
      // if (sub !== '') {
      //   this.subjectOption = subjectDict.filter(item => item.includes(sub))
      //   return
      // } else if (this.form.fullTimeMajor.length === 0) {
      //   this.subjectOption = []
      // }
    },
    // 策略名称输入验证
    inputValidator(v) {
      if (v === null || v === undefined) {
        return false
      }
      if (v.trim() === '') {
        return false
      }
      if (this.customs.some(i => i.name === v.trim())) {
        return '名称不能重复'
      }
      return true
    },
    parseFormData() {
      const temp = {}
      for (const k of Object.keys(this.form)) {
        if (!isEmpty(this.form[k])) {
          temp[k] = this.form[k]
        }
      }
      return temp
    },
    getTwoPostOption() {
      return [
        { label: '不限', value: '不限', disabled: false },
        {
          label: '职务',
          value: '职务',
          disabled: false,
          children: this.levels.map(i => ({ label: i.name, value: i.id }))
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container ::v-deep .el-cascader__tags {
  flex-wrap: nowrap!important;
  overflow: hidden;
}

</style>
