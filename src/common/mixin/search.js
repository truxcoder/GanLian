/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-02-10 10:23:14
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
          if (
            Object.prototype.toString.call(this.searchForm[key]) === '[object String]' &&
            (this.searchForm[key].includes("'") || this.searchForm[key].includes('or') || this.searchForm[key].includes('and') || this.searchForm[key].includes('--'))
          ) {
            this.$message.error('查询参数包含非法字符!')
            return false
          }
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
