/*
 * @Author: truxcoder
 * @Date: 2021-11-29 15:44:54
 * @LastEditTime: 2022-08-03 15:35:52
 * @LastEditors: truxcoder
 * @Description: 个人情况页mixin
 */
import { request } from '@/api/index'
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
      rowData: {},
      currentEditIndex: 0
    }
  },
  computed: {
    canOperate() {
      return this.can.update || this.can.delete
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
    }
  }
}
