<!--
 * @Author: truxcoder
 * @Date: 2022-02-08 19:46:18
 * @LastEditTime: 2022-03-16 17:05:31
 * @LastEditors: truxcoder
 * @Description: 事件详情
-->
<template>
  <el-dialog v-loading="dialogLoading" width="1200px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-card>
      <div class=" font-semibold text-center text-lg">{{ row.title }}</div>
      <div class="text-center mt-2">涉及人员: {{ person }}</div>
      <el-divider />
      <div v-html="intro">
        <!-- <pre>{{ intro }}</pre> -->
      </div>
    </el-card>

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
    personName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      resource: 'affair',
      currentData: {},
      intro: '',
      dialogLoading: false
    }
  },
  computed: {
    person() {
      return this.row.personnelName ?? this.personName
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.fetchData()
      } else {
        this.intro = ''
      }
    }
  },
  methods: {
    fetchData() {
      this.dialogLoading = true
      request(this.resource, 'one', { id: this.row.id }).then(response => {
        this.intro = response.data?.intro ?? ''
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
