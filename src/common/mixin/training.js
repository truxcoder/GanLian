/*
 * @Author: truxcoder
 * @Date: 2021-11-25 12:19:05
 * @LastEditTime: 2022-02-07 16:28:52
 * @LastEditors: truxcoder
 * @Description:
 */
import rules from '@/common/rules/training'
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
      form: { title: '', place: '', organ: '', department: '', property: '', period: '', startTime: '', endTime: '', intro: '' },
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' },
      rules,
      loading: false,
      dialogLoading: false
    }
  }
}
