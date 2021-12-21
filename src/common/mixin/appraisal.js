import rules from '@/common/rules/appraisal'
export const mixin = {
  props: {
    passedData: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
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
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { personnelId: '', organId: '', years: '', conclusion: '' },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      rules,
      loading: false,
      dialogLoading: false
    }
  }
}
