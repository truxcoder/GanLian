/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:22:20
 * @LastEditTime: 2022-01-06 12:16:07
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  getTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  dictId: [{ required: true, message: '请选择处理项', trigger: 'change' }],
  docNumber: [{ required: true, message: '请输入文号', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择影响期', trigger: 'change' }]
}
