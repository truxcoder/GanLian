/*
 * @Author: truxcoder
 * @Date: 2021-10-25 17:31:28
 * @LastEditTime: 2022-03-03 15:46:27
 * @LastEditors: truxcoder
 * @Description: 人员信息模型
 */
import { suggestions } from './suggestions'
import { politicalDict, proCertDict, passportDict } from '@/utils/dict'
const YesOrNo = [
  { label: '是', value: 2 },
  { label: '否', value: 1 }
]
const genderList = ['男', '女']

const oneColumn = { width: '220px' }
// const twoColumn = { width: '600px' }
const threeColumn = { width: '940px' }

export default {
  name: { type: 'STRING', label: '姓名', style: oneColumn, order: 1, disabled: true },
  gender: { type: 'SELECT', label: '性别', style: oneColumn, order: 2, options: genderList, disabled: false },
  nation: { type: 'AUTOCOMPLETE', label: '民族', style: oneColumn, order: 3, suggestion: suggestions.queryNation, disabled: false },
  idCode: { type: 'STRING', label: '身份证号码', style: oneColumn, order: 4, disabled: true },
  policeCode: { type: 'STRING', label: '警号/工号', style: oneColumn, order: 5, disabled: false },
  political: { type: 'SELECT', label: '政治面貌', style: oneColumn, order: 6, options: politicalDict, disabled: false },
  // organId: { type: 'STRING', label: '所属单位', order: 7 },
  // departmentId: { type: 'STRING', label: '所属部门', order: 8 },
  isSecret: { type: 'SELECT2', label: '岗位是否涉密', style: oneColumn, order: 7, options: YesOrNo, disabled: false },
  // hasPassport: { type: 'SELECT2', label: '是否持有护照', order: 8, options: YesOrNo, disabled: false },
  passport: { type: 'SELECT2', label: '持有护照情况', style: oneColumn, order: 8, options: passportDict, multiple: true, disabled: false },
  phone: { type: 'STRING', label: '联系电话', style: oneColumn, order: 9, disabled: false },
  joinPartyDay: { type: 'DATE', label: '入党日期', style: oneColumn, order: 10, disabled: false },
  joinPartyPrePeriodStart: { type: 'DATE', label: '入党预备期开始时间', style: oneColumn, order: 11, disabled: false },
  joinPartyPrePeriodEnd: { type: 'DATE', label: '入党预备期结束时间', style: oneColumn, order: 12, disabled: false },
  startJobDay: { type: 'DATE', label: '参加工作时间', style: oneColumn, order: 13, disabled: false },
  bePoliceDay: { type: 'DATE', label: '录警时间', style: oneColumn, order: 14, disabled: false },
  passExamDay: { type: 'DATE', label: '通过县处级考试时间', style: oneColumn, order: 15, disabled: false },
  fullTimeEdu: { type: 'AUTOCOMPLETE', label: '全日制教育学历', style: oneColumn, order: 16, suggestion: suggestions.queryFullTimeEdu, disabled: false },
  fullTimeMajor: { type: 'AUTOCOMPLETE', label: '全日制教育专业', style: oneColumn, order: 17, suggestion: suggestions.querySubject, disabled: false },
  fullTimeSchool: { type: 'STRING', label: '全日制毕业院校', style: oneColumn, order: 18, disabled: false },
  partTimeEdu: { type: 'AUTOCOMPLETE', label: '非全日制教育学历', style: oneColumn, order: 19, suggestion: suggestions.queryPartTimeEdu, disabled: false },
  partTimeMajor: { type: 'AUTOCOMPLETE', label: '非全日制教育专业', style: oneColumn, order: 20, suggestion: suggestions.querySubject, disabled: false },
  partTimeSchool: { type: 'STRING', label: '非全日制毕业院校', style: oneColumn, order: 21, disabled: false },
  proCert: { type: 'SELECT', label: '取得专业证书情况', style: threeColumn, order: 22, options: proCertDict, multiple: true, disabled: false }
  // proCert: { type: 'AUTOCOMPLETE', label: '取得专业证书情况', order: 19, suggestion: suggestions.queryProCert, disabled: false },
  // training: { type: 'TEXT', label: '参加培训情况', style: threeColumn, order: 20, disabled: false }
  // resume: { type: 'TEXT', label: '个人简历', order: 21, disabled: false }
}
