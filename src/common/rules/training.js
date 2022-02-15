/*
 * @Author: truxcoder
 * @Date: 2021-11-25 12:21:39
 * @LastEditTime: 2022-02-07 16:37:27
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  place: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  organ: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  property: [{ required: true, message: '请选择性质', trigger: 'change' }],
  period: [{ required: true, message: '请输入学时', trigger: 'blur' }],
  grade: [{ required: true, message: '请选择级别', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}
