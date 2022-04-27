<!--
 * @Author: truxcoder
 * @Date: 2021-12-22 10:10:06
 * @LastEditTime: 2022-04-24 09:54:16
 * @LastEditors: truxcoder
 * @Description:奖励详情页
-->
<template>
  <el-dialog title="奖励详情" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div id="award-container">
      <el-descriptions title="" :column="2" label-class-name="award-desc-label" border>
        <el-descriptions-item label="姓名">{{ row.personnelName }}</el-descriptions-item>
        <el-descriptions-item label="警号/工号">{{ row.policeCode }}</el-descriptions-item>
        <el-descriptions-item label="所属单位">{{ row.organShortName }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ options.category[row.category - 1] && options.category[row.category - 1].label }}</el-descriptions-item>
        <el-descriptions-item label="等级/奖励项">{{ itemMap.get(row.grade) }}</el-descriptions-item>
        <el-descriptions-item label="奖励时间">{{ row.getTime | dateFilter }}</el-descriptions-item>
        <el-descriptions-item label="奖励文号">{{ row.docNumber }}</el-descriptions-item>
        <el-descriptions-item label="决定机关">{{ row.organ }}</el-descriptions-item>
        <el-descriptions-item label="奖励内容">{{ row.content }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
export default {
  name: 'AwardDetail',
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
    itemMap: {
      type: Map,
      default() {
        return new Map()
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
      this.$emit('visibleChange', 'detail')
    }
  }
}
</script>

<style lang="scss" scoped>
#award-container ::v-deep .award-desc-label {
  width: 8rem;
}
</style>
