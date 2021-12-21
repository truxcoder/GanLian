import remoteDepartmentData from '@/api/departmentData.json'
export const department_mixin = {
  data() {
    return {
      departmentData: []
    }
  },
  computed: {
    departmentParentMap() {
      const newMap = {}
      this.departmentData
        .filter(item => item.deptType == 1)
        .forEach(item => {
          newMap[item.busOrgCode] = { name: item.name, id: item.deptId, shortName: item.shortName }
        })
      return newMap
    },
    departmentMap() {
      const newMap = {}
      this.departmentData.forEach(item => (newMap[item.deptId] = { name: item.name, id: item.deptId, busOrgCode: item.busOrgCode }))
      return newMap
    },
    departmentList() {
      return this.departmentData.map(item => {
        const parent = this.departmentParentMap[item.busOrgCode] ? this.departmentParentMap[item.busOrgCode].name : ' '
        return { label: item.name + ' 〔' + parent + '〕', value: item.deptId }
      })
    },
    organList() {
      return this.departmentData
        .filter(item => item.deptType == 1)
        .map(item => {
          return { name: item.name, id: item.id, shortName: item.shortName }
        })
    },
    organMap() {
      const newMap = {}
      this.organList.forEach(item => (newMap[item.id] = item))
      return newMap
    }
  },
  methods: {
    getOrganName(organId, shortName = 'long') {
      if (!this.organMap.hasOwnProperty(organId)) {
        return '找不到单位'
      }
      if (shortName === 'short' && 'shortName' in this.organMap[organId]) {
        return this.organMap[organId].shortName
      } else if (shortName === 'long' && 'name' in this.organMap[organId]) {
        return this.organMap[organId].name
      } else {
        return '未找到'
      }
    },
    getOrganNameFromDeptId(departmentId, shortName = 'long') {
      const busOrgCode = this.departmentMap[departmentId].busOrgCode
      if (shortName === 'short') {
        return this.departmentParentMap[busOrgCode].shortName
      } else {
        return this.departmentParentMap[busOrgCode].name
      }
    }
  }
}
