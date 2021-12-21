import rules from '@/common/rules/post'
import { getPositionList } from '@/api/position'
import { getLevelList } from '@/api/level'
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
      form: { personnelId: '', departmentId: '', organId: '', startDay: '', endDay: '', positionId: '', levelId: '' },
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
        return { label: item.name + ' 〔' + item.Level.name + '〕', value: item.id }
      })
      const levelOptions = this.remoteLevelList.map(item => {
        return { label: item.name, value: item.id }
      })
      const departmentOptions = this.$store.getters.departments.map(item => {
        const parent = this.organMap[item.busOrgCode] ? this.organMap[item.busOrgCode].name : ' '
        return { label: item.name + ' 〔' + parent + '〕', value: item.id }
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
      const promises = [getPositionList(), getLevelList()]
      Promise.all(promises).then(responses => {
        this.remotePositionList = responses[0].data
        this.remoteLevelList = responses[1].data
      })
    }
  }
}
