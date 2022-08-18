<!--
 * @Author: truxcoder
 * @Date: 2022-05-18 14:09:17
 * @LastEditTime: 2022-08-08 10:22:10
 * @LastEditors: truxcoder
 * @Description: 干部监督数据审核详情页
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :title="'干部监督数据审核 〔' + getStatus(row.status) + '〕'" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div id="review-container">
      <div><span class=" font-bold pr-4">版块:</span><el-tag size="small" type="success">{{ getCategory(row.category) }}</el-tag></div>
      <hr class="my-2" />
      <div><span class=" font-bold pr-4">动作:</span><el-tag size="small" :type="action === 'delete' ? 'danger' : 'success'">{{ getAction() }}</el-tag></div>
      <hr class="my-2" />
      <div class="mb-2"><span class=" font-bold">内容:</span></div>
      <!-- 版块为处分管理的情况 -->
      <el-descriptions v-if="row.category === 101" class="margin-top" title="" :column="2" label-class-name="desc-label" content-class-name="desc-content" border>
        <el-descriptions-item v-for="(v, k) in models" :key="k" :label="models[k].label"> {{ getFiltedData(k) }} </el-descriptions-item>
      </el-descriptions>
      <!-- 版块为经济责任审计、个人事项核查、巡视巡查检查的情况 -->
      <el-card v-if="row.category === 103 || row.category === 104 || row.category === 105">
        <div class=" font-semibold text-center text-lg">{{ content.title }}</div>
        <div class="text-center mt-2">涉及人员: {{ getPersonnelName(content.personnelId) }}</div>
        <el-divider />
        <div v-html="action === 'delete' ? intro : content.intro" />
      </el-card>
      <!-- 版块为信访举报的情况 -->
      <div v-if="row.category === 102">
        <div class="flex w-full">
          <div class="w-1/2">
            <div class=" font-semibold mb-2">{{ report.title }}</div>
            <!-- <hr class="mb-4" /> -->
            <el-descriptions class="margin-top" title="" :column="1" border>
              <el-descriptions-item label="涉及人员">
                <!-- action为添加的情况 -->
                <span v-for="(v, k) in content.person" :key="k" class=" pr-2">
                  <el-link :href="getDetailLink(v)" type="primary" target="_blank">{{ getPersonnelName(v) }}</el-link>
                </span>
                <!-- action为编辑的情况 -->
                <span v-for="(v, k) in content.current" :key="k" class=" pr-2">
                  <el-link :href="getDetailLink(v)" type="primary" target="_blank">{{ getPersonnelName(v) }}</el-link>
                </span>
                <!-- action为删除的情况 -->
                <span v-for="(v, k) in content.personnels" :key="k" class=" pr-2">
                  <el-link :href="getDetailLink(v.id)" type="primary" target="_blank">{{ v.name }}</el-link>
                </span>

              </el-descriptions-item>
              <el-descriptions-item label="受理时间"> {{ report.reportTime | dateFilter }} </el-descriptions-item>
              <el-descriptions-item label="当前阶段"> {{ report.step | stepFilter }} </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class=" flex-1 ml-4">
            <el-card>
              <div>
                <div class=" font-semibold">处置情况</div>
                <el-divider />
              </div>
              <div>{{ report.intro }}</div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="danger" :disabled="row.status === 2" @click="onReject">驳 回</el-button>
      <el-button type="success" :disabled="row.status === 2" @click="onPass">通 过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import dayjs from 'dayjs'
import { curd, request } from '@/api'
import { incorruptionReviewCategoryDict, reviewStatusDict } from '@/utils/dict'
import { getDetailLink } from '@/utils/personnel'

export default {
  name: 'IncorruptionReviewDetail',
  filters: {
    stepFilter(step) {
      let result
      switch (step) {
        case 1:
          result = '谈话函询阶段'
          break
        case 2:
          result = '初步核查阶段'
          break
        case 3:
          result = '立案查询调查阶段'
          break
        case 100:
          result = '调查完结(属实)'
          break
        case 99:
          result = '调查完结(不属实)'
          break

        default:
          result = '未定义'
          break
      }
      return result
    }
  },
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
    },
    disDict: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      resource: 'review',
      currentData: {},
      intro: '',
      steps: [],
      incorruptionReviewCategoryDict,
      activeName: 'first',
      dialogLoading: false
    }
  },
  computed: {
    orginContent() {
      if (!this.row?.content) {
        return {}
      }
      return JSON.parse(JSON.parse(this.row.content)?.data)
    },
    content() {
      const temp = { ...this.orginContent }
      if ('id' in temp) {
        this.$delete(temp, 'id')
      }
      // if ('personnelId' in temp) {
      //   this.$delete(temp, 'personnelId')
      // }
      return temp
    },
    action() {
      if (!this.row?.content) {
        return ''
      }
      return JSON.parse(this.row.content)?.action
    },
    report() {
      return this.action === 'delete' ? this.content : this.content.report
    },
    disCategoryMap() {
      const temp = new Map()
      temp.set(1, '党纪处分')
      temp.set(2, '政务处分')
      temp.set(3, '处分')
      return temp
    },
    models() {
      switch (this.row.category) {
        case 101:
          return {
            personnelId: { label: '人员姓名' },
            category: { label: '类别' },
            docNumber: { label: '处分文号' },
            dictId: { label: '处分项' },
            getTime: { label: '处分时间', type: 'DATE' },
            deadline: { label: '影响期限', type: 'DATE' },
            organ: { label: '决定机关' },
            content: { label: '处分内容' }
          }

        default:
          return {}
      }
    },
    disDictMap() {
      const temp = {}
      this.disDict.forEach(i => {
        temp[i.id] = i
      })
      return temp
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true && this.action === 'delete' && (this.row.category === 103 || this.row.category === 104 || this.row.category === 105)) {
        this.fetchAffairData()
      } else {
        this.intro = ''
      }
    }
  },
  methods: {
    fetchAffairData() {
      this.dialogLoading = true
      const id = JSON.parse(JSON.parse(this.row.content)?.data).id
      request('affair', 'one', { id }).then(response => {
        this.intro = response.data?.intro ?? ''
        this.dialogLoading = false
      })
    },
    getFiltedData(k) {
      const v = this.content[k]
      if (k === 'personnelId') {
        return this.$store.state.personnel.personnelMap[v]
      }
      if (k === 'dictId') {
        return this.disDictMap[v]?.name
      }
      if (this.row.category === 101 && k === 'category') {
        return this.disCategoryMap.get(v)
      }
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
    getPersonnelName(id) {
      return this.$store.state.personnel.personnelMap[id] ?? '未知'
    },
    getCategory(c) {
      for (const i of incorruptionReviewCategoryDict) {
        if (i.value === c) {
          return i.label
        }
      }
      return '未定义'
    },
    getStatus(s) {
      for (const i of reviewStatusDict) {
        if (i.value === s) {
          return i.label
        }
      }
      return '未定义'
    },
    getAction() {
      if (!this.row?.content) {
        return '未知'
      }
      const content = JSON.parse(this.row.content)
      switch (content?.action) {
        case 'add':
          return '添加'
        case 'update':
          return '修改'
        case 'delete':
          return '删除'
        default:
          return '未知'
      }
    },
    isShow(v) {
      if ('cum' in v) {
        return false
      }
      return true
    },
    getDetailLink(id) {
      return getDetailLink(id)
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
