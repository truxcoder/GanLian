/*
 * @Author: truxcoder
 * @Date: 2021-11-16 12:48:28
 * @LastEditTime: 2022-02-10 14:54:54
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  department: [{ required: true, message: '请选择或输入部门', trigger: 'change' }],
  organ: [{ required: true, message: '请选择或输入单位', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择职务', trigger: 'change' }],
  levelId: [{ required: true, message: '请选择级别', trigger: 'change' }],
  startDay: [{ required: true, message: '请选择日期', trigger: 'change' }]
}
