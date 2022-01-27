/*
 * @Author: truxcoder
 * @Date: 2021-10-25 17:31:28
 * @LastEditTime: 2022-01-26 14:16:00
 * @LastEditors: truxcoder
 * @Description: 人员信息模型
 */
import { suggestions } from './suggestions'
import { politicalDict, proCertDict } from '@/utils/dict'
const YesOrNo = [
  { label: '是', value: true },
  { label: '否', value: false }
]
const genderList = ['男', '女']

export default {
  name: { type: 'STRING', label: '姓名', order: 1, disabled: true },
  gender: { type: 'SELECT', label: '性别', order: 2, options: genderList, disabled: false },
  nation: { type: 'AUTOCOMPLETE', label: '民族', order: 3, suggestion: suggestions.queryNation, disabled: false },
  idCode: { type: 'STRING', label: '身份证号码', order: 4, disabled: true },
  policeCode: { type: 'STRING', label: '警号/工号', order: 5, disabled: false },
  political: { type: 'SELECT', label: '政治面貌', order: 6, options: politicalDict, disabled: false },
  // organId: { type: 'STRING', label: '所属单位', order: 7 },
  // departmentId: { type: 'STRING', label: '所属部门', order: 8 },
  isSecret: { type: 'SELECT2', label: '岗位是否涉密', order: 7, options: YesOrNo, disabled: false },
  hasPassport: { type: 'SELECT2', label: '是否持有护照', order: 8, options: YesOrNo, disabled: false },
  phone: { type: 'STRING', label: '联系电话', order: 9, disabled: false },
  joinPartyDay: { type: 'DATE', label: '入党日期', order: 10, disabled: false },
  joinPartyPrePeriodStart: { type: 'DATE', label: '入党预备期开始时间', order: 11, disabled: false },
  joinPartyPrePeriodEnd: { type: 'DATE', label: '入党预备期结束时间', order: 12, disabled: false },
  startJobDay: { type: 'DATE', label: '参加工作时间', order: 13, disabled: false },
  bePoliceDay: { type: 'DATE', label: '录警时间', order: 14, disabled: false },
  fullTimeEdu: { type: 'AUTOCOMPLETE', label: '全日制教育学历', order: 16, suggestion: suggestions.queryFullTimeEdu, disabled: false },
  fullTimeMajor: { type: 'AUTOCOMPLETE', label: '全日制教育专业', order: 17, suggestion: suggestions.querySubject, disabled: false },
  partTimeEdu: { type: 'AUTOCOMPLETE', label: '非全日制教育学历', order: 18, suggestion: suggestions.queryPartTimeEdu, disabled: false },
  passExamDay: { type: 'DATE', label: '通过县处级考试时间', order: 18, disabled: false },
  proCert: { type: 'SELECT', label: '取得专业证书情况', order: 19, options: proCertDict, multiple: true, disabled: false },
  // proCert: { type: 'AUTOCOMPLETE', label: '取得专业证书情况', order: 19, suggestion: suggestions.queryProCert, disabled: false },
  training: { type: 'TEXT', label: '参加培训情况', order: 20, disabled: false }
  // resume: { type: 'TEXT', label: '个人简历', order: 21, disabled: false }
}
