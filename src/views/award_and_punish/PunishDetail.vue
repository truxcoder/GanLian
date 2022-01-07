<!--
 * @Author: truxcoder
 * @Date: 2021-12-22 10:10:06
 * @LastEditTime: 2021-12-22 15:49:39
 * @LastEditors: truxcoder
 * @Description:处理详情页
-->
<template>
  <el-dialog title="处理详情" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-descriptions title="" :column="2" border>
      <el-descriptions-item label="姓名">{{ row.personnelName }}</el-descriptions-item>
      <el-descriptions-item label="警号/工号">{{ row.policeCode }}</el-descriptions-item>
      <el-descriptions-item label="类别">{{ options.category[row.category - 1] && options.category[row.category - 1].label }}</el-descriptions-item>
      <el-descriptions-item label="处理项">{{ options.grade[row.grade - 1] && options.grade[row.grade - 1].label }}</el-descriptions-item>
      <el-descriptions-item label="处理时间">{{ row.getTime | dateFilter }}</el-descriptions-item>
      <el-descriptions-item label="处理文号">{{ row.docNumber }}</el-descriptions-item>
      <el-descriptions-item label="处理内容">{{ row.content }}</el-descriptions-item>
    </el-descriptions>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
export default {
  name: 'PunishDetail',
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
      dialogWidth: '900px'
    }
  },
  methods: {
    onClose() {
      this.$emit('detailClose')
    }
  }
}
</script>

<style></style>
