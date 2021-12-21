import { getDepartmentList } from '@/api/department'
import { transToTreeData } from '@/utils/user'
export const mixin = {
  data() {
    return {
      departmentData: [],
      departmentFormList: [],
      departmentTreeList: []
    }
  },
  created() {
    this.departmentFormList = this.departmentData.filter(item => item.isentity)
  },
  methods: {
    fetchDptData() {
      getDepartmentList({}).then(response => {
        this.departmentData = response.data
        this.departmentFormList = this.departmentData.filter(item => item.isentity)
        this.departmentTreeList = transToTreeData(this.departmentData)
      })
    }
  }

}

