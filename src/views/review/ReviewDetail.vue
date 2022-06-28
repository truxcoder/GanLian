<!--
 * @Author: truxcoder
 * @Date: 2022-05-18 14:09:17
 * @LastEditTime: 2022-06-14 10:32:11
 * @LastEditors: truxcoder
 * @Description: 审核详情页
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :title="row.personnelName + '干部信息审核' + ' 〔' + getStatus(row.status) + '〕'" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div id="review-container">
      <el-descriptions v-if="row.category === 1 || row.category === 2 || row.category === 4" class="margin-top" title="" :column="2" label-class-name="desc-label" content-class-name="desc-content" border>
        <!-- <el-descriptions-item label="姓名"> {{ row.personnelName }} </el-descriptions-item>
        <el-descriptions-item label="单位"> {{ row.organShortName }} </el-descriptions-item> -->
        <el-descriptions-item v-for="(v, k) in content" :key="k" :label="models[k].label"> {{ getFiltedData(v, k) }} </el-descriptions-item>
      </el-descriptions>
      <div v-if="row.category === 3" class=" leading-6">
        <li v-for="(v, k) in resumeList" v-show="isShow(v)" :key="k" class="list-none">{{ formatResume(k, v, resumeList) }}</li>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="danger" :disabled="row.status === 2" @click="onReject">驳 回</el-button>
      <el-button type="success" @click="onPass">通 过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import models from '@/common/model/personnel'
import dayjs from 'dayjs'
import { curd, request } from '@/api'
import { reviewStatusDict, passportDict } from '@/utils/dict'
import { formatResume } from '@/utils/resume'

export default {
  name: 'ReviewDetail',
  mixins: [common_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      resource: 'review',
      currentData: {},
      intro: '',
      steps: [],
      activeName: 'first',
      dialogLoading: false,
      formatResume
    }
  },
  computed: {
    orginContent() {
      if (!this.row?.content) {
        return {}
      }
      return JSON.parse(this.row.content)
    },
    content() {
      const temp = { ...this.orginContent }
      if ('id' in temp) {
        this.$delete(temp, 'id')
      }
      if ('personnelId' in temp) {
        this.$delete(temp, 'personnelId')
      }
      return temp
    },
    models() {
      switch (this.row.category) {
        case 1:
          return models
        case 2:
          return {
            fullTimeEdu: { label: '全日制教育学历' },
            fullTimeDegree: { label: '全日制教育学位' },
            fullTimeMajor: { label: '全日制教育专业' },
            fullTimeSchool: { label: '全日制教育毕业院校' },
            partTimeEdu: { label: '在职教育学历' },
            partTimeDegree: { label: '在职教育学位' },
            partTimeMajor: { label: '在职教育专业' },
            partTimeSchool: { label: '在职教育毕业院校' },
            finalEdu: { label: '最高教育学历' },
            finalDegree: { label: '最高教育学位' },
            finalMajor: { label: '最高教育专业' },
            finalSchool: { label: '最高教育毕业院校' }
          }
        case 4:
          return { name: { label: '家属姓名' }, gender: { label: '性别' }, relation: { label: '称谓' }, birthday: { label: '出生日期', type: 'MONTH' }, political: { label: '政治面貌' }, organ: { label: '工作单位' }, post: { label: '职务' }, isAbroad: { label: '是否定居国外', type: 'BOOL' }}

        default:
          return {}
      }
    },
    resumeList() {
      const resume = this.row?.content ?? ''
      let result = []
      if (resume === '') {
        return []
      }
      result = JSON.parse(resume)
      return result
    }
  },
  methods: {
    passportFilter(passport) {
      passport = passport ?? ''
      if (passport === '') {
        return '无'
      }
      const _map = new Map()
      passportDict.forEach(i => {
        _map.set(i.value, i.label)
      })
      const temp = JSON.parse(passport)
      if (Array.isArray(temp)) {
        return temp.map(i => _map.get(i)).join(', ')
      }
      return '错误'
    },
    getFiltedData(v, k) {
      if (this.models[k]?.type === 'DATE') {
        return dayjs(v).format('YYYY年MM月DD日')
      }
      if (this.models[k]?.type === 'MONTH') {
        return dayjs(v).format('YYYY年MM月')
      }
      if (this.models[k]?.type === 'BOOL') {
        return v ? '是' : '否'
      }
      if (k === 'passport') {
        return this.passportFilter(v)
      }
      return v
    },
    onPass() {
      const data = { ...this.row }
      data.status = 2
      data.reviewer = this.$store.getters.personnelId
      // if (data.category === 2) {
      //   data = this.orginContent
      //   data.content = this.orginContent
      // }
      request('review', 'pass', data)
        .then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('editSuccess')
        })
        .catch(err => {
          console.log(err)
          this.dialogLoading = false
        })
    },
    onReject() {
      const data = { id: this.row.id, status: -1, reviewer: this.$store.getters.personnelId }
      curd('update', data, { resource: this.resource })
        .then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('editSuccess')
        })
        .catch(err => {
          console.log(err)
          this.dialogLoading = false
        })
    },
    onCancel() {
      this.$emit('visibleChange', 'detail')
    },
    getStatus(s) {
      for (const i of reviewStatusDict) {
        if (i.value === s) {
          return i.label
        }
      }
      return '未定义'
    },
    isShow(v) {
      if ('cum' in v) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
#review-container ::v-deep .desc-label {
  width: 10%;
}
#review-container ::v-deep .desc-content {
  width: 20%;
}
</style>
