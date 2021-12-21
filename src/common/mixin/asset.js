import rules from '@/common/rules/asset'
import models from '@/common/model/asset'
export const mixin = {
  props: {
    departmentList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      statusList: ['正常', '维修', '损坏', '报废', '丢失'],
      form: {},
      formLabelWidth: '120px',
      formItemWidth: { width: '230px' },
      rules,
      dialogLoading: false,
      models
    }
  },
  computed: {
    formItemData() {
      return Object.keys(models).sort((a, b) => models[a].order - models[b].order)
    }
  }
}

