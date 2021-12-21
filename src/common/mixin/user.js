import rules from '@/common/rules/user'
import models from '@/common/model/user'
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
      statusList: [{ label: '启用', value: true }, { label: '停用', value: false }],
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

