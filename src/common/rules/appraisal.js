/*
 * @Author: truxcoder
 * @Date: 2021-11-18 17:48:09
 * @LastEditTime: 2022-01-26 15:10:43
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  organId: [{ required: true, message: '请选择单位', trigger: 'change' }],
  years: [{ required: true, message: '请选择年份', trigger: 'change' }],
  season: [{ required: true, message: '请选择季度', trigger: 'change' }],
  conclusion: [{ required: true, message: '请选择考核结果', trigger: 'change' }]
}
