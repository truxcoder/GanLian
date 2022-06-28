/*
 * @Author: truxcoder
 * @Date: 2021-11-25 12:21:39
 * @LastEditTime: 2022-06-08 10:50:33
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  place: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  sponsor: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  organizer: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  method: [{ required: true, message: '请选择方式', trigger: 'change' }],
  period: [{ required: true, message: '请输入学时', trigger: 'blur' }],
  isInner: [{ required: true, message: '请选择是或否', trigger: 'change' }],
  isFullTime: [{ required: true, message: '请选择是或否', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}
