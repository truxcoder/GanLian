/*
 * @Author: truxcoder
 * @Date: 2022-01-10 17:39:10
 * @LastEditTime: 2022-03-01 16:42:29
 * @LastEditors: truxcoder
 * @Description: 编辑页mixin
 */
export const edit_mixin = {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
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
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formLabelLongWidth: '600px',
      formItemWidth: { width: '220px' },
      formLineWidth: { width: '720px' },
      formTextAreaWidth: { width: '940px' },
      loading: false,
      dialogLoading: false
    }
  },
  computed: {
    actName() {
      switch (this.action) {
        case 'add':
          return '添加'
        case 'update':
          return '编辑'
        default:
          return ''
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('visibleChange', 'edit')
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
