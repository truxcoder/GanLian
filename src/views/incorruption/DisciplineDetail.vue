<!--
 * @Author: truxcoder
 * @Date: 2021-12-22 10:10:06
 * @LastEditTime: 2022-04-24 10:12:02
 * @LastEditors: truxcoder
 * @Description:处理详情页
-->
<template>
  <el-dialog title="处分详情" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div id="dis-container">
      <el-descriptions title="" :column="2" label-class-name="dis-desc-label" border>
        <el-descriptions-item label="姓名">{{ isSingle ? singlePersonnelData.name : row.personnelName }}</el-descriptions-item>
        <el-descriptions-item v-if="!isSingle" label="单位">{{ row.organShortName }}</el-descriptions-item>
        <el-descriptions-item label="处分文号">{{ row.docNumber }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ options.category[row.category - 1] && options.category[row.category - 1].label }}</el-descriptions-item>
        <el-descriptions-item label="处分项">{{ row.dictName }}</el-descriptions-item>
        <el-descriptions-item label="处分时间">{{ row.getTime | dateFilter }}</el-descriptions-item>
        <el-descriptions-item label="影响时限">{{ row.deadline | dateFilter }}</el-descriptions-item>
        <el-descriptions-item label="决定机关">{{ row.organ }}</el-descriptions-item>
        <el-descriptions-item label="处分内容">{{ row.content }}</el-descriptions-item>
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
  name: 'DisciplineDetail',
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
    isSingle: {
      type: Boolean,
      default() {
        return false
      }
    },
    singlePersonnelData: {
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
      this.$emit('visibleChange', 'detail')
    }
  }
}
</script>

<style lang="scss" scoped>
#dis-container ::v-deep .dis-desc-label {
  width: 6rem;
}
</style>
