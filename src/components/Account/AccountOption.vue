<!--
 * @Author: truxcoder
 * @Date: 2022-04-19 16:32:12
 * @LastEditTime: 2022-04-19 19:35:44
 * @LastEditors: truxcoder
 * @Description: 帐号选择组件
-->
<template>
  <el-select
    :value="value"
    :disabled="disabled"
    :size="size"
    :style="width"
    filterable
    remote
    placeholder="请选择帐号"
    :remote-method="filterMethod"
    :loading="loading"
    @change="onChange"
  >
    <el-option v-for="i in isUpdate ? accountList : accountOptions" :key="i.value" :label="i.label" :value="i.value" />
  </el-select>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    width: {
      type: Object,
      default() {
        return {}
      }
    },
    isUpdate: {
      type: Boolean,
      default() {
        return false
      }
    },
    size: {
      type: String,
      default() {
        return 'medium'
      }
    }
  },
  data() {
    return {
      loading: false,
      disabled: false,
      accountOptions: []
    }
  },
  computed: {
    storeOptions() {
      return this.$store.getters.accountOptions
    },
    accountList() {
      if (Object.keys(this.row).length !== 0 && this.accountOptions.length === 0) {
        return [
          {
            value: this.row.id,
            label: this.row.name + ' 〔' + this.row.username + '〕'
          }
        ]
      } else {
        return this.accountOptions
      }
    }
  },
  created() {
    if (this.$store.getters.accountOptions.length === 0) {
      this.disabled = true
      this.$store.dispatch('account/changeAccountOptions').then(res => {
        this.disabled = false
      })
    }
  },
  methods: {
    filterMethod: _.debounce(function(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        this.accountOptions = this.storeOptions.filter(item => item.label.indexOf(query) === 0)
        this.loading = false
      } else {
        this.accountOptions = []
      }
    }, 300),
    onChange(value) {
      this.$emit('input', value)
    },
    clean() {
      this.accountOptions = []
    }
  }
}
</script>

<style></style>
