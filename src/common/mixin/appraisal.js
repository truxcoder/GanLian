/*
 * @Author: truxcoder
 * @Date: 2021-11-18 17:46:34
 * @LastEditTime: 2022-01-26 15:11:43
 * @LastEditors: truxcoder
 * @Description:
 */
import rules from '@/common/rules/appraisal'
import { conclusionDict, seasonDict } from '@/utils/dict'
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
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { personnelId: '', organId: '', years: '', season: '', conclusion: '' },
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
    options() {
      const years = []
      for (let index = 2010; index < 2030; index++) {
        years.push({ label: index + '年', value: index + '' })
      }
      const conclusion = conclusionDict
      return {
        organ: this.$store.getters.organs,
        years,
        conclusion,
        season: seasonDict
      }
    }
  }
}
