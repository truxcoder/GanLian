import rules from '@/common/rules/personnel'
import models from '@/common/model/personnel'
import _ from 'lodash'
export const mixin = {
  props: {
    organList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formItemWidth: { width: '220px' },
      formTextAreaWidth: { width: '940px' },
      rules,
      dialogLoading: false,
      models,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  computed: {
    formItemData() {
      return Object.keys(models).sort((a, b) => models[a].order - models[b].order)
    }
  }
}

export const perOptionMixin = {
  props: {
    options: {
      type: Object,
      default() {
        return {}
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
      loading: false,
      personnelOpitons: [],
      remotePersonnelData: []
    }
  },
  computed: {
    personnelList() {
      if (Object.keys(this.rowdata).length !== 0 && this.personnelOpitons.length === 0) {
        return [{ value: this.rowdata.personnelId, label: this.rowdata.personnelName + ' 〔' + this.rowdata.policeCode + '〕' }]
      } else {
        return this.personnelOpitons
      }
    }
  },
  methods: {
    // remoteMethod: _.debounce(function(query) {
    //   query = query.trim()
    //   if (query !== '') {
    //     this.loading = true
    //     console.log("query:",query)
    //     personnelSearchName({ name: query }).then( res => {
    //       this.remotePersonnelData = res.data
    //       this.loading = false
    //     })
    //   } else {
    //     this.remotePersonnelData = []
    //   }
    // }, 1000),
    filterMethod: _.debounce(function(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        console.log('query:', query)
        this.personnelOpitons = this.options.personnel.filter(item => item.label.indexOf(query) === 0)
        this.loading = false
      } else {
        this.personnelOpitons = []
      }
    }, 600)
  }
}
