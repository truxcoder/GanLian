<template>
  <el-select
    v-model="personnelId"
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
    <el-option v-for="i in isUpdate ? personnelList : personnelOpitons" :key="i.vaule" :label="i.label" :value="i.value" />
  </el-select>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
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
    },
    isClean: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      loading: false,
      disabled: false,
      personnelOpitons: [],
      personnelId: this.rowdata?.personnelId
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
  watch: {
    isClean: function(val, oldval) {
      if (val) {
        this.personnelId = ''
        this.personnelOpitons = []
      }
    }
  },
  created() {
    if (this.$store.state.personnel.personnelOptions.length === 0) {
      this.disabled = true
      this.$store.dispatch('personnel/changePerOptions').then(res => {
        console.log('dispatch,length:', this.$store.state.personnel.personnelOptions.length)
        this.disabled = false
      })
    }
    console.log('personnelOptions.length:', this.$store.state.personnel.personnelOptions.length)
  },
  methods: {
    // remoteMethod: _.debounce(function(query) {
    //   query = query.trim()
    //   if (query !== '') {
    //     this.loading = true
    //     console.log("query:",query)
    //     personnelSearchName({ name: query }).then( res => {
    //       this.remotePersonnelData = res.data
    //       this.loading = false
    //     })
    //   } else {
    //     this.remotePersonnelData = []
    //   }
    // }, 1000),
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
      this.$emit('personnelChange', value)
    }
  }
}
</script>

<style></style>
