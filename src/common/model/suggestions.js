import { request } from '@/api/index'
let fullTimeEdu = []
let partTimeEdu = []
request('personnel', 'dict').then(res => {
  fullTimeEdu = res.data
    ? res.data
        .filter(item => item.category === 1)
        .map(item => {
          return { value: item.name }
        })
    : []
  partTimeEdu = res.data
    ? res.data
        .filter(item => item.category === 2)
        .map(item => {
          return { value: item.name }
        })
    : []
})
const values = {
  nation: [
    { value: '汉族' },
    { value: '蒙古族' },
    { value: '回族' },
    { value: '藏族' },
    { value: '维吾尔族' },
    { value: '苗族' },
    { value: '彝族' },
    { value: '壮族' },
    { value: '布依族' },
    { value: '朝鲜族' },
    { value: '满族' },
    { value: '侗族' },
    { value: '瑶族' },
    { value: '白族' },
    { value: '土家族' },
    { value: '哈尼族' },
    { value: '哈萨克族' },
    { value: '傣族' },
    { value: '黎族' },
    { value: '僳僳族' },
    { value: '佤族' },
    { value: '畲族' },
    { value: '高山族' },
    { value: '拉祜族' },
    { value: '水族' },
    { value: '东乡族' },
    { value: '纳西族' },
    { value: '景颇族' },
    { value: '柯尔克孜族' },
    { value: '土族' },
    { value: '达斡尔族' },
    { value: '仫佬族' },
    { value: '羌族' },
    { value: '布朗族' },
    { value: '撒拉族' },
    { value: '毛南族' },
    { value: '仡佬族' },
    { value: '锡伯族' },
    { value: '阿昌族' },
    { value: '普米族' },
    { value: '塔吉克族' },
    { value: '怒族' },
    { value: '乌孜别克族' },
    { value: '俄罗斯族' },
    { value: '鄂温克族' },
    { value: '德昂族' },
    { value: '保安族' },
    { value: '裕固族' },
    { value: '京族' },
    { value: '塔塔尔族' },
    { value: '独龙族' },
    { value: '鄂伦春族' },
    { value: '赫哲族' },
    { value: '门巴族' },
    { value: '珞巴族' },
    { value: '基诺族' }
  ],
  fullTimeEdu: [
    { value: '博士研究生' },
    { value: '硕士研究生' },
    { value: '博士' },
    { value: '硕士' },
    { value: '大学本科学士' },
    { value: '大学本科' },
    { value: '大学专科' },
    { value: '中专' },
    { value: '中技' },
    { value: '高中' },
    { value: '初中' }
  ],
  partTimeEdu: [
    { value: '在职博士研究生' },
    { value: '在职硕士研究生' },
    { value: '在职大学' },
    { value: '在职大专' },
    { value: '成人教育大学' },
    { value: '成人教育大专' },
    { value: '省委党校硕士研究生' },
    { value: '省委党校大学' },
    { value: '省委党校大专' },
    { value: '中央党校博士研究生' },
    { value: '中央党校硕士研究生' },
    { value: '中央党校大学' }
  ],
  ranks: [
    { value: '三级警司' },
    { value: '二级警司' },
    { value: '一级警司' },
    { value: '三级警督' },
    { value: '二级警督' },
    { value: '一级警督' },
    { value: '三级警监' },
    { value: '二级警监' },
    { value: '一级警监' }
  ],
  grades: [
    { value: '一级警务专员' },
    { value: '二级警务专员' },
    { value: '一级高级警长' },
    { value: '二级高级警长' },
    { value: '三级高级警长' },
    { value: '四级高级警长' },
    { value: '一级警长' },
    { value: '二级警长' },
    { value: '三级警长' },
    { value: '一级警员' },
    { value: '二级警员' },
    { value: '一级巡视员' },
    { value: '二级巡视员' },
    { value: '一级调研员' },
    { value: '二级调研员' },
    { value: '三级调研员' },
    { value: '四级调研员' },
    { value: '一级主任科员' },
    { value: '二级主任科员' },
    { value: '三级主任科员' },
    { value: '四级主任科员' },
    { value: '一级科员' },
    { value: '二级科员' }
  ],
  levels: [
    { value: '正厅级' },
    { value: '副厅级' },
    { value: '正局级' },
    { value: '副局级' },
    { value: '正处级' },
    { value: '副处级' },
    { value: '正科级' },
    { value: '副科级' },
    { value: '科员级' },
    { value: '办事员级' },
    { value: '未确定' }
  ],
  subject: [
    { value: '法学' },
    { value: '新闻学' },
    { value: '监狱学' },
    { value: '汉语言文学' },
    { value: '经济学' },
    { value: '化学' },
    { value: '数学' },
    { value: '心理学' },
    { value: '物理' },
    { value: '医学' }
  ],
  proCert: [{ value: '律师资格证' }, { value: '三级心理咨询师' }, { value: '二级心理咨询师' }, { value: '一级建造师' }, { value: '软件架构师' }, { value: '教师资格证' }]
}

function createFilter(queryString) {
  return data => data.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
}

export const suggestions = {
  queryNation(queryString, cb) {
    const data = values.nation
    const results = queryString ? data.filter(createFilter(queryString)) : data
    // 调用 callback 返回建议列表的数据
    cb(results)
  },
  queryFullTimeEdu(queryString, cb) {
    const data = fullTimeEdu
    const results = queryString ? data.filter(createFilter(queryString)) : data
    cb(results)
  },
  queryPartTimeEdu(queryString, cb) {
    const data = partTimeEdu
    var results = queryString ? data.filter(createFilter(queryString)) : data
    cb(results)
  },
  querySubject(queryString, cb) {
    const data = values.subject
    var results = queryString ? data.filter(createFilter(queryString)) : data
    cb(results)
  },
  queryProCert(queryString, cb) {
    const data = values.proCert
    var results = queryString ? data.filter(createFilter(queryString)) : data
    cb(results)
  }
}

export const options_mixin = {
  methods: {}
}
