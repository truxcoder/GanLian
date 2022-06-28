<!--
 * @Author: truxcoder
 * @Date: 2022-05-18 14:09:17
 * @LastEditTime: 2022-05-24 09:26:34
 * @LastEditors: truxcoder
 * @Description: 反馈详情页
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :title="row.personnelName + '干部信息反馈' + ' 〔' + getStatus(row.status) + '〕'" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div id="feedback-container">
      <div class=" leading-6">
        <el-card>
          <div>{{ row.content }}</div>
        </el-card>

      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="danger" :disabled="row.status === 2" @click="onSubmit(-1)">不处理</el-button>
      <el-button type="success" @click="onSubmit(2)">已处理</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { common_mixin } from '@/common/mixin/mixin'
import { curd } from '@/api'
import { feedbackStatusDict } from '@/utils/dict'

export default {
  name: 'FeedbackDetail',
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
      resource: 'feedback',
      currentData: {},
      intro: '',
      steps: [],
      activeName: 'first',
      dialogLoading: false
    }
  },
  methods: {
    onSubmit(status) {
      const data = { id: this.row.id, status, feedbacker: this.$store.getters.personnelId }
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
      for (const i of feedbackStatusDict) {
        if (i.value === s) {
          return i.label
        }
      }
      return '未定义'
    }
  }
}
</script>

<style lang="scss" scoped>
#feedback-container ::v-deep .desc-label {
  width: 10%;
}
#feedback-container ::v-deep .desc-content {
  width: 20%;
}
</style>
