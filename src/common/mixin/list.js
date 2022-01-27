/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-01-20 16:29:08
 * @LastEditors: truxcoder
 * @Description: 列表mixin
 */
export const list_mixin = {
  data() {
    return {
      updateVisible: false,
      addVisible: false,
      dialogPrintVisible: false,
      rowData: {},
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
      this.fetchData(this.searchData)
    },
    updateSuccess(row) {
      this.updateVisible = false
      this.fetchData(this.searchData)
    },
    handleSizeChange(size) {
      this.pageSize = size
      if (this.queryMeans === 'backend') {
        this.fetchData(this.searchData)
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      if (this.queryMeans === 'backend') {
        this.fetchData(this.searchData)
      }
    },
    buildParams(queryMeans) {
      if (queryMeans !== 'backend') {
        return this.defaultSearchData
      }
      let params = {}
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      params = { ...params, ...this.defaultSearchData }
      return params
    }
  }
}
