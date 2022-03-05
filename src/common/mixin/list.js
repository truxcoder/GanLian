/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-03-04 09:15:33
 * @LastEditors: truxcoder
 * @Description: 列表mixin
 */
export const list_mixin = {
  data() {
    return {
      updateVisible: false,
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      action: '',
      currentEditIndex: 0,
      currentPage: 1,
      pageSize: 10,
      rowSuccessClass: '',
      listLoading: true,
      count: 0
    }
  },
  computed: {
    total() {
      return this.queryMeans === 'backend' ? this.count : this.currentData.length
    },
    currentPageData() {
      return this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  methods: {
    handleUpdate(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.updateVisible = true
    },
    visibleChange(cpn) {
      const visible = cpn + 'Visible'
      this[visible] = false
    },
    updateVisibleChange() {
      this.updateVisible = false
    },
    addSuccess() {
      this.addVisible = false
      this.fetchData(this.searchData, this.queryParam)
    },
    editSuccess() {
      this.editVisible = false
      this.fetchData(this.searchData, this.queryParam)
    },
    updateSuccess(row) {
      this.updateVisible = false
      this.fetchData(this.searchData, this.queryParam)
    },
    handleAllData() {
      this.searchData = {}
      this.queryParam = {}
      this.currentPage = 1
      this.fetchData()
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
    handleSizeChange(size) {
      this.pageSize = size
      if (this.queryMeans === 'backend') {
        this.fetchData(this.searchData, this.queryParam)
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      if (this.queryMeans === 'backend') {
        this.fetchData(this.searchData, this.queryParam)
      }
    },
    onDetail(row) {
      const url = this.$router.resolve({
        path: '/perdetail',
        query: { id: row.id }
      })
      window.open(url.href, '_blank')
      // this.$router.push({ path: 'pdetail' })
    },
    buildParams(queryMeans, param) {
      // 如果接收到的param里包含organId，则用此参数替换defaultSearchData
      let organParam = this.defaultSearchData
      if (param && 'organId' in param) {
        organParam = param
      }
      if (queryMeans !== 'backend') {
        return organParam
      }
      let params = {}
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      params = { ...params, ...organParam }
      return params
    }
  }
}
