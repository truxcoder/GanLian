/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:20:15
 * @LastEditTime: 2022-02-17 14:14:36
 * @LastEditors: truxcoder
 * @Description:
 */
import rules from '@/common/rules/report'
export const mixin = {
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    action: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: { title: '', reportTime: '', step: '', intro: '' },
      stepForm: { step: '', time: '', content: '' },
      personnels: '',
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' },
      rules,
      loading: false,
      dialogLoading: false,
      stepRules: {
        content: [{ required: true, message: '请输入本步骤主要内容', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        step: [{ required: true, message: '请选择阶段', trigger: 'change' }]
      }
    }
  },
  methods: {
    onCategoryChange() {
      this.form.dictId = ''
    }
  }
}
