import dayjs from 'dayjs'
import { getAge } from '@/utils/index'
import { request, curd } from '@/api/index'

export const mixin = {
  props: {
    baseData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      action: '',
      editVisible: false,
      updateVisible: false,
      detailVisible: false,
      addVisible: false,
      originData: [],
      currentData: [],
      multipleSelection: [],
      rowData: {},
      currentEditIndex: 0
    }
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
    },
    dateEndFilter(date) {
      if (date === '') {
        return date
      }
      const endDate = new Date(date)
      const now = new Date()
      if (endDate > now) {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月DD日')
    }
  },

  methods: {
    fetchData() {
      this.queryData = { id: this.$route.query.id }
      request(this.resource, 'detail', this.queryData).then(response => {
        this.originData = response.data ?? []
        this.currentData = response.data ?? []
      })
    },
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
    editSuccess() {
      this.editVisible = false
      this.fetchData()
    },
    addSuccess() {
      this.addVisible = false
      this.fetchData()
    },
    updateSuccess() {
      this.updateVisible = false
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit(act, row) {
      this.action = act
      if (act === 'add') {
        this.rowData = {}
      } else {
        this.rowData = row
      }
      this.editVisible = true
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
              this.fetchData()
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
              this.fetchData()
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
