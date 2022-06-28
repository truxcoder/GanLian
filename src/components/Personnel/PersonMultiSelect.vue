<template>
  <el-select
    v-model="personnels"
    :disabled="disabled"
    :size="size"
    :style="formItemWidth"
    filterable
    remote
    multiple
    placeholder="请选择人员"
    :remote-method="filterMethod"
    :loading="loading"
    @change="onChange"
  >
    <el-option v-for="i in isUpdate ? personnelList : personnelOpitons" :key="i.value" :label="i.label" :value="i.value" />
    <!-- <el-option v-for="i in personnelOpitons" :key="i.value" :label="i.label" :value="i.value" /> -->
  </el-select>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'PersonMultiSelect',
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    persons: {
      type: Array,
      default() {
        return []
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
      personnels: this.persons.length ? this.persons.map(i => i.id) : []
    }
  },
  computed: {
    storeOptions() {
      return this.$store.state.personnel.personnelOptions
    },
    personnelList() {
      if (!this.persons.length) {
        return this.personnelOpitons
      }
      let origin = []
      if (this.persons.length) {
        origin = this.persons.map(i => {
          return { value: i.id, label: i.name + ' 〔' + i.policeCode + '〕' + '〔' + i.organShortName + '〕' }
        })
      }
      // const origin = this.persons.length
      //   ? this.persons.map(i => {
      //       return { value: i.id, label: i.name + ' 〔' + i.policeCode + '〕' + '〔' + i.organShortName + '〕' }
      //     })
      //   : []
      if (this.personnelOpitons.length === 0) {
        return origin
      }
      const originIdList = this.persons.length ? this.persons.map(i => i.id) : []
      const temp = this.personnelOpitons.filter(item => !originIdList.includes(item.value))
      // temp.push(...origin)
      origin.push(...temp)

      return origin
      // if (this.personnels.length !== 0 && this.personnelOpitons.length === 0) {
      //   return this.persons.map(i => {
      //     return { value: i.id, label: i.name + ' 〔' + i.policeCode + '〕' }
      //   })
      // } else if (this.personnels.length !== 0) {
      //   const temp = this.personnels.map(i => {
      //     return { value: i.id, label: i.name + ' 〔' + i.policeCode + '〕' }
      //   })
      //   const temp = this.personnelOpitons.map(item => item.id)
      //   this.persons.forEach(i => {
      //     if (!temp.includes(i.id)) {
      //       thi
      //     }
      //   });
      //   return [...temp, ...this.personnelOpitons]
      // } else {
      //   return this.personnelOpitons
      // }
    }
  },
  watch: {
    isClean: function(val, oldval) {
      if (val) {
        this.personnels = ''
        this.personnelOpitons = []
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
