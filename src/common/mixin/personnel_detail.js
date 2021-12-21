import dayjs from 'dayjs'
import { getAge } from '@/utils/index'
export const mixin = {
  props: {
    passedData: {
      type: Array,
      default() {
        return []
      }
    },
    singlePersonnelData: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      dialogLoading: false,
      updateFormVisible: false,
      addFormVisible: false,
      // mainData: [],
      multipleSelection: [],
      rowData: {},
      currentEditIndex: 0
    }
  },
  computed: {
    mainData: {
      get: function() {
        return this.passedData
      },
      set: function(index) {
        this.mainData.splice(index, 1)
      }
    }
  },
  watch: {
    // passedData: function(val, oldval) {
    //   // this.mainData = { ...val }
    //   if (Object.keys(val).length) {
    //     for (const i of Object.keys(val)) {
    //       this.$set(this.mainData, i, val[i])
    //     }
    //   }
    // }
  },
  filters: {
    ageFilter(age) {
      return getAge(dayjs(age).format('YYYY-MM-DD'))
    },
    dateFilter(date) {
      if (dayjs(date).year() === 2100) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    }
  },
  methods: {
    addVisibleChange() {
      this.addFormVisible = false
    },
    updateVisibleChange() {
      this.updateFormVisible = false
    },
    addSuccess() {
      this.addFormVisible = false
      this.$emit('reFetchCpnData', this.cpnName)
    },
    updateSuccess(row) {
      this.updateFormVisible = false
      this.$emit('reFetchCpnData', this.cpnName)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.updateFormVisible = true
    }
  }
}
