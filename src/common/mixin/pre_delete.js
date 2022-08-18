/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-08-08 14:46:09
 * @LastEditors: truxcoder
 * @Description: 预删除数据mixin
 */
import { request, curd } from '@/api/index'
export const delete_mixin = {
  data() {
    return {
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(row, category) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const content = {
            action: 'delete',
            data: JSON.stringify(row)
          }
          const data = {
            personnelId: this.$store.getters.personnelId,
            organId: this.$store.getters.organ,
            category,
            content: JSON.stringify(content)
          }
          const result = category === 104 ? curd('delete', { id: [row.id] }, { resource: this.resource }) : request('pre', null, data)
          result
            .then(response => {
              this.$message.success(response.message)
              // 如果是个人事项核查模块，重新请求数据
              if (category === 104) {
                if (this.isPerDetailPage) {
                  this.fetchData()
                } else {
                  this.fetchData(this.searchData, this.queryParam)
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    deleteMutiData(category) {
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = this.multipleSelection.map(item => {
            const content = {
              action: 'delete',
              data: JSON.stringify(item)
            }
            return {
              personnelId: this.$store.getters.personnelId,
              organId: this.$store.getters.organ,
              category,
              content: JSON.stringify(content)
            }
          })
          const result = category === 104 ? curd('delete', { id: this.multipleSelection.map(item => item.id) }, { resource: this.resource }) : request('pre_batch', null, data)
          result
            .then(response => {
              this.$message.success(response.message)
              // 如果是个人事项核查模块，重新请求数据
              if (category === 104) {
                if (this.isPerDetailPage) {
                  this.fetchData()
                } else {
                  this.fetchData(this.searchData, this.queryParam)
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
