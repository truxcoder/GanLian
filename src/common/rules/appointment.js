/*
 * @Author: truxcoder
 * @Date: 2021-11-18 17:48:09
 * @LastEditTime: 2022-06-22 11:26:43
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'blur' }],
  appointPost: [{ required: true, message: '请输入拟任职务', trigger: 'blur' }],
  removePost: [{ required: true, message: '请输入拟免职务', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入任免理由', trigger: 'blur' }],
  opinion: [{ required: true, message: '请输入审批机关意见', trigger: 'blur' }]
}
