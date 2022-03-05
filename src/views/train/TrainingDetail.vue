<!--
 * @Author: truxcoder
 * @Date: 2022-02-08 19:46:18
 * @LastEditTime: 2022-03-03 19:18:11
 * @LastEditors: truxcoder
 * @Description: 培训详情
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="flex w-full">
      <div class="w-1/2">
        <div class=" font-semibold mb-2">{{ row.title }}</div>
        <hr class="mb-4" />
        <el-descriptions class="margin-top" title="" :column="2" border>
          <el-descriptions-item label="开始时间"> {{ row.startTime | dateFilter }} </el-descriptions-item>
          <el-descriptions-item label="结束时间"> {{ row.endTime | dateFilter }} </el-descriptions-item>
          <el-descriptions-item label="培训地点"> {{ row.place }} </el-descriptions-item>
          <el-descriptions-item label="培训性质"> {{ row.property === 1 ? '系统内培训' : '系统外培训' }} </el-descriptions-item>
          <el-descriptions-item label="组织单位"> {{ row.organ }} </el-descriptions-item>
          <el-descriptions-item label="组织部门"> {{ row.department }} </el-descriptions-item>
          <el-descriptions-item label="培训学时"> {{ row.period }}学时 </el-descriptions-item>
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
    }
  }
}
</script>

<style></style>
