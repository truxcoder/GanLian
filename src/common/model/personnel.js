/*
 * @Author: truxcoder
 * @Date: 2021-10-25 17:31:28
 * @LastEditTime: 2022-06-15 15:35:10
 * @LastEditors: truxcoder
 * @Description: 人员信息模型
 */
import { suggestions } from './suggestions'
import { politicalDict, proCertDict, passportDict, marriageDict } from '@/utils/dict'
const YesOrNo = [
  { label: '是', value: 2 },
  { label: '否', value: 1 }
]
const genderList = ['男', '女']

const oneColumn = { width: '220px' }
const twoColumn = { width: '590px' }
const threeColumn = { width: '960px' }

export default {
  name: { type: 'STRING', label: '姓名', style: oneColumn, order: 1, disabled: true },
  gender: { type: 'SELECT', label: '性别', style: oneColumn, order: 2, options: genderList, disabled: false },
  nation: { type: 'AUTOCOMPLETE', label: '民族', style: oneColumn, order: 3, suggestion: suggestions.queryNation, disabled: false },
  idCode: { type: 'STRING', label: '身份证号码', style: oneColumn, order: 4, disabled: true },
  policeCode: { type: 'STRING', label: '警号/工号', style: oneColumn, order: 5, disabled: false },
  political: { type: 'SELECT', label: '政治面貌', style: oneColumn, order: 6, options: politicalDict, disabled: false },
  hometown: { type: 'STRING', label: '籍贯', style: oneColumn, order: 7, disabled: false },
  birthplace: { type: 'STRING', label: '出生地', style: oneColumn, order: 8, disabled: false },
  marriage: { type: 'SELECT', label: '婚姻状况', style: oneColumn, order: 9, options: marriageDict, disabled: false },
  isSecret: { type: 'SELECT2', label: '岗位是否涉密', style: oneColumn, order: 10, options: YesOrNo, disabled: false },
  passport: { type: 'SELECT2', label: '持有护照情况', style: oneColumn, order: 11, options: passportDict, multiple: true, filterable: true, create: true, disabled: false },
  phone: { type: 'STRING', label: '联系电话', style: oneColumn, order: 12, disabled: false },
  joinPartyDay: { type: 'MONTH', label: '入党日期', style: oneColumn, order: 13, disabled: false },
  joinPartyPrePeriodStart: { type: 'MONTH', label: '入党预备期开始时间', style: oneColumn, order: 14, disabled: false },
  joinPartyPrePeriodEnd: { type: 'MONTH', label: '入党预备期结束时间', style: oneColumn, order: 15, disabled: false },
  startJobDay: { type: 'MONTH', label: '参加工作时间', style: oneColumn, order: 16, disabled: false },
  bePoliceDay: { type: 'DATE', label: '录警时间', style: oneColumn, order: 17, disabled: false },
  passExamDay: { type: 'DATE', label: '通过县处级考试时间', style: oneColumn, order: 18, disabled: false },
  health: { type: 'STRING', label: '健康状况', style: oneColumn, order: 28, disabled: false },
  technicalTitle: { type: 'STRING', label: '专业技术职务', style: oneColumn, order: 29, disabled: false },
  specialty: { type: 'STRING', label: '专长', style: oneColumn, order: 30, disabled: false },
  proCert: { type: 'SELECT', label: '取得专业证书情况', style: threeColumn, order: 40, options: proCertDict, multiple: true, filterable: true, create: true, disabled: false },
  remark: { type: 'STRING', label: '备注', style: threeColumn, order: 50, disabled: false }
}
