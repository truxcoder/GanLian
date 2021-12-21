import rules from '@/common/rules/organ'
import models from '@/common/model/organ'
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
      rules,
      dialogLoading: false,
      models
    }
  },
  computed: {
    formItemData() {
      return Object.keys(models).sort((a, b) => models[a].order - models[b].order)
    },
    organList() {
      if (this.passedData.length == 0) {
        return [{ id: '0', name: '司法厅' }]
      } else return this.passedData
    },
    wholeOrganList() {
      const temp = [...this.passedData]
      temp.push({ id: '0', name: '司法厅' })
      return temp
    }
  }
}

