/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:20:15
 * @LastEditTime: 2021-12-22 15:20:33
 * @LastEditors: truxcoder
 * @Description:
 */
import rules from '@/common/rules/punish'
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
      form: { personnelId: '', category: '', getTime: '', grade: '', content: '', docNumber: '' },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      rules,
      loading: false,
      dialogLoading: false
    }
  },
  computed: {
    gradeList() {
      return this.options.grade.filter(item => {
        let isTrue = true
        switch (this.form.category) {
          case 1:
            isTrue = item.value < 6
            break
          case 2:
            isTrue = item.value > 5
            break
          default:
            isTrue = true
            break
        }
        return isTrue
      })
    }
  }
}
