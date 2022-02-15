/*
 * @Author: truxcoder
 * @Date: 2021-11-16 09:13:38
 * @LastEditTime: 2022-02-10 14:56:26
 * @LastEditors: truxcoder
 * @Description:
 */
import rules from '@/common/rules/post'
import { request } from '@/api/index'
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
      form: { personnelId: '', department: '', organ: '', startDay: '', endDay: '', positionId: '', levelId: '' },
      dialogWidth: '900px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      remotePositionList: [],
      remoteLevelList: [],
      rules,
      loading: false,
      dialogLoading: false
    }
  },
  computed: {
    organMap() {
      const newMap = {}
      this.$store.getters.organs.forEach(item => (newMap[item.busOrgCode] = item))
      return newMap
    },
    options() {
      const positionOptions = this.remotePositionList.map(item => {
        return { label: item.name + ' 〔' + item.levelName + '〕', value: item.id }
      })
      const levelOptions = this.remoteLevelList.map(item => {
        return { label: item.name, value: item.id }
      })
      const departmentOptions = this.$store.getters.departments.map(item => {
        const parent = this.organMap[item.busOrgCode] ? this.organMap[item.busOrgCode].name : ' '
        return { label: item.name + ' 〔' + parent + '〕', value: item.name }
      })
      return {
        department: departmentOptions,
        organ: this.$store.getters.organs,
        position: positionOptions,
        level: levelOptions
      }
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.fetchAllData()
  },
  methods: {
    fetchAllData() {
      const promises = [request('position', 'list'), request('level', 'list')]
      Promise.all(promises).then(responses => {
        this.remotePositionList = responses[0].data
        this.remoteLevelList = responses[1].data
      })
    }
  }
}
