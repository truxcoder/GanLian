/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:20:15
 * @LastEditTime: 2022-01-06 12:15:41
 * @LastEditors: truxcoder
 * @Description:
 */
import rules from '@/common/rules/discipline'
export const mixin = {
  props: {
    disDict: {
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
    isSingle: {
      type: Boolean,
      default() {
        return false
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { personnelId: '', category: '', getTime: '', dictId: '', content: '', docNumber: '', deadline: '' },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '590px' },
      rules,
      loading: false,
      dialogLoading: false
    }
  },
  computed: {
    disDictList() {
      return this.disDict.filter(item => item.category === this.form.category)
    }
  }
}
