/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:22:20
 * @LastEditTime: 2021-12-22 15:22:33
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  getTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  grade: [{ required: true, message: '请选择级别', trigger: 'change' }],
  docNumber: [{ required: true, message: '请输入文号', trigger: 'change' }]
}
