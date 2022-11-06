<!--
 * @Author: truxcoder
 * @Date: 2022-02-08 19:46:18
 * @LastEditTime: 2022-08-31 09:36:32
 * @LastEditors: truxcoder
 * @Description: 培训详情
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="flex w-full">
      <div id="training-container" class="w-1/2">
        <div class=" font-semibold mb-2">{{ row.title }}</div>
        <hr class="mb-4" />
        <el-descriptions class="margin-top" title="" :column="2" label-class-name="training-desc-label" border>
          <el-descriptions-item label="开始时间"> {{ row.startTime | dateFilter }} </el-descriptions-item>
          <el-descriptions-item label="结束时间"> {{ row.endTime | dateFilter }} </el-descriptions-item>
          <el-descriptions-item label="培训地点"> {{ row.place }} </el-descriptions-item>
          <el-descriptions-item label="培训分类"> {{ getCategory(row.category) }} </el-descriptions-item>
          <el-descriptions-item label="主办单位"> {{ row.sponsor }} </el-descriptions-item>
          <el-descriptions-item label="承办单位"> {{ row.organizer }} </el-descriptions-item>
          <el-descriptions-item label="培训方式"> {{ getMethod(row.method) }} </el-descriptions-item>
          <el-descriptions-item label="培训学时"> {{ row.period }}学时 </el-descriptions-item>
          <el-descriptions-item label="是否脱产"> {{ getYesOrNo(row.isFullTime) }} </el-descriptions-item>
          <el-descriptions-item label="仅本单位参加"> {{ getYesOrNo(row.isInner) }} </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class=" flex-1 ml-4">
        <el-card>
          <div>
            <div class=" font-semibold">培训简介</div>
            <el-divider />
          </div>
          <div>{{ row.intro }}</div>
        </el-card>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import { isEmpty } from 'lodash/lang'

export default {
  name: 'TrainingDetail',
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
      resource: 'training',
      dialogLoading: false
    }
  },
  methods: {
    onCancel() {
      this.$emit('visibleChange', 'detail')
    },
    getCategory(c) {
      const item = this.options.categoryDict.filter(i => i.value === c)
      if (isEmpty(item)) {
        return ''
      }
      if (item[0].parent !== 0) {
        const parent = this.options.categoryDict.filter(i => i.value === item[0].parent)
        return parent[0].label + '/' + item[0].label
      }
      return item[0].label
    },
    getMethod(m) {
      const item = this.options.methodDict.filter(i => i.value === m)
      if (isEmpty(item)) {
        return ''
      }
      if (item[0].parent !== 0) {
        const parent = this.options.methodDict.filter(i => i.value === item[0].parent)
        return parent[0].label + '/' + item[0].label
      }
      return item[0].label
    },
    getYesOrNo(v) {
      switch (v) {
        case 2:
          return '是'
        case 1:
          return '否'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#training-container ::v-deep .training-desc-label {
  width: 7rem;
}
</style>
