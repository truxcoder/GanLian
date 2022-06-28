<!--
 * @Author: truxcoder
 * @Date: 2022-04-01 11:30:14
 * @LastEditTime: 2022-04-01 14:18:50
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <el-select
    :value="value"
    :disabled="disabled"
    :size="size"
    :style="formItemWidth"
    filterable
    remote
    placeholder="请选择人员"
    :remote-method="filterMethod"
    :loading="loading"
    @change="onChange"
  >
    <el-option v-for="i in isUpdate ? personnelList : personnelOpitons" :key="i.value" :label="i.label" :value="i.value" />
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
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    },
    formItemWidth: {
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
      personnelOpitons: []
    }
  },
  computed: {
    storeOptions() {
      return this.$store.state.personnel.personnelOptions
    },
    personnelList() {
      if (Object.keys(this.rowdata).length !== 0 && this.personnelOpitons.length === 0) {
        return [
          {
            value: this.rowdata.personnelId,
            label: this.rowdata.personnelName + ' 〔' + this.rowdata.policeCode + '〕'
          }
        ]
      } else {
        return this.personnelOpitons
      }
    }
  },
  created() {
    if (this.$store.state.personnel.personnelOptions.length === 0) {
      this.disabled = true
      this.$store.dispatch('personnel/changePerOptions').then(res => {
        this.disabled = false
      })
    }
  },
  methods: {
    filterMethod: _.debounce(function(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        console.log('query:', query)
        this.personnelOpitons = this.storeOptions.filter(item => item.label.indexOf(query) === 0)
        this.loading = false
      } else {
        this.personnelOpitons = []
      }
    }, 600),
    onChange(value) {
      this.$emit('input', value)
    },
    clean() {
      this.personnelOpitons = []
    }
  }
}
</script>

<style></style>
