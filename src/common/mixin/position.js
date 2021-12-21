import rules from '@/common/rules/position'
import models from '@/common/model/position'
export const mixin = {
  props: {
    passedData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      submitBtnDisabled:false,
      rules,
      dialogLoading: false,
      models
    }
  },
  computed: {
    formItemData() {
      return Object.keys(models).sort((a, b) => models[a].order - models[b].order)
    },
  }
}

