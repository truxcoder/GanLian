/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-01-18 17:21:59
 * @LastEditors: truxcoder
 * @Description: 列表页搜索mixin
 */
export const search_mixin = {
  data() {
    return {
      searchData: {},
      isClean: false
    }
  },
  methods: {
    onPersonnelChange(value) {
      this.searchForm.personnelId = value
      this.isClean = false
    },
    onSearch() {
      const searchData = {}
      let searchParamNumber = 0
      for (const key in this.searchForm) {
        if (this.searchForm[key] !== '') {
          searchData[key] = this.searchForm[key]
          searchParamNumber++
        }
      }
      if (!searchParamNumber) {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！'
        })
        return
      }
      this.searchData = searchData
      this.currentPage = 1
      this.fetchData(searchData)
      this.onClean()
    },
    // 清空搜索框
    onClean() {
      this.$refs.searchForm.resetFields()
      this.isClean = true
    }
  }
}
