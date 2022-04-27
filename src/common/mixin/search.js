import { isEmpty } from '@/utils/validate'

/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-04-13 18:46:43
 * @LastEditors: truxcoder
 * @Description: 列表页搜索mixin
 */
export const search_mixin = {
  data() {
    return {
      searchData: {},
      queryParam: {}
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
        // if (this.searchForm[key] !== '') {
        if (!isEmpty(this.searchForm[key])) {
          if (Object.prototype.toString.call(this.searchForm[key]) === '[object String]' && (this.searchForm[key].includes("'") || this.searchForm[key].includes('or') || this.searchForm[key].includes('and') || this.searchForm[key].includes('--'))) {
            this.$message.error('查询参数包含非法字符!')
            return false
          }
          // 如果查询key不是organParam，则添加searchData中，否则往fetchData里传一个param，包含单位id, 以便buildParams接收。
          if (key !== 'organParam') {
            searchData[key] = this.searchForm[key]
          } else {
            this.queryParam = { organId: this.searchForm[key] }
          }
          searchParamNumber++
        } else if (key === 'organParam') {
          this.queryParam = {}
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
      this.fetchData(searchData, this.queryParam)
      this.onClean()
    },
    // 清空搜索框
    onClean() {
      this.$refs.searchForm.resetFields()
      if (this.$refs.personnelOption) {
        this.$refs.personnelOption.clean()
      }
      // this.queryParam = {}
    }
  }
}
