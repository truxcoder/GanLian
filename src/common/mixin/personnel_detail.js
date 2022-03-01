import dayjs from 'dayjs'
import { getAge } from '@/utils/index'
import { curd } from '@/api/index'
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
      updateVisible: false,
      detailVisible: false,
      addVisible: false,
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
    visibleChange(cpn) {
      const visible = cpn + 'Visible'
      this[visible] = false
    },
    addVisibleChange() {
      this.addVisible = false
    },
    updateVisibleChange() {
      this.updateVisible = false
    },
    addSuccess() {
      this.addVisible = false
      this.$emit('reFetchCpnData', this.cpnName)
    },
    updateSuccess(row) {
      this.updateVisible = false
      this.$emit('reFetchCpnData', this.cpnName)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.updateVisible = true
    },
    handleDelete(index, id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          curd('delete', { id: [id] }, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.mainData = index
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteMutiData() {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          curd('delete', { id: this.multipleSelection.map(item => item.id) }, { resource: this.resource })
            .then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$emit('reFetchCpnData', this.cpnName)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
