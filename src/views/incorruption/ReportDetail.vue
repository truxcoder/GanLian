<!--
 * @Author: truxcoder
 * @Date: 2022-02-08 19:46:18
 * @LastEditTime: 2022-02-18 11:20:18
 * @LastEditors: truxcoder
 * @Description: 举报详情
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="举报基本情况" name="first">
        <div class="flex w-full">
          <div class="w-1/2">
            <div class=" font-semibold mb-2">{{ row.title }}</div>
            <!-- <hr class="mb-4" /> -->
            <el-descriptions class="margin-top" title="" :column="1" border>
              <el-descriptions-item label="涉及人员">
                <el-tooltip v-for="(v, k) in row.personnels" :key="k" placement="top">
                  <div slot="content">警号: {{ v.policeCode }}<br />单位: {{ v.organShortName }}</div>
                  <!-- <el-tag type="danger" size="small" effect="plain" class="pr-1">{{ v.name }}</el-tag> -->
                  <span class="pr-1 underline text-red-500">{{ v.name }}</span>
                </el-tooltip>
              </el-descriptions-item>
              <el-descriptions-item label="受理时间"> {{ row.reportTime | dateFilter }} </el-descriptions-item>
              <el-descriptions-item label="当前阶段"> {{ row.step | stepFilter }} </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class=" flex-1 ml-4">
            <el-card>
              <div>
                <div class=" font-semibold">举报简介</div>
                <el-divider />
              </div>
              <div>{{ intro }}</div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="举报受理过程" name="second">
        <h1 v-if="!steps.length">无过程信息</h1>
        <el-timeline v-if="steps.length">
          <el-timeline-item v-for="(item, index) in steps" :key="index" :timestamp="item.time" placement="top" :color="item.color" :type="index === 0 ? 'success' : 'info'">
            <el-card>
              <div class="flex items-center">
                <div class="font-semibold">
                  <span>{{ item.step | stepFilter }}</span>
                </div>
              </div>
              <div>{{ item.content }}</div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import { request } from '@/api/index'

export default {
  name: 'ReportDetail',
  filters: {
    personList(arr) {
      if (!arr) {
        return '无'
      }
      return arr.map(item => item.name).join(', ')
    },
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
    }
  },
  data() {
    return {
      resource: 'report',
      currentData: {},
      intro: '',
      steps: [],
      activeName: 'first',
      dialogLoading: false
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.fetchData()
      } else {
        this.intro = ''
        this.activeName = 'first'
      }
    }
  },
  methods: {
    fetchData() {
      this.dialogLoading = true
      request(this.resource, 'one', { id: this.row.id }).then(response => {
        this.intro = response.data?.intro ?? ''
        this.steps = response.data?.steps ? JSON.parse(response.data?.steps) : []
        this.dialogLoading = false
      })
    },
    onCancel() {
      this.$emit('visibleChange', 'detail')
    }
  }
}
</script>

<style></style>
