/*
 * @Author: truxcoder
 * @Date: 2021-11-16 12:48:28
 * @LastEditTime: 2022-02-28 15:14:47
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  passport: [{ required: true, message: '请选择证件', trigger: 'change' }],
  destination: [
    { required: true, message: '请输入目的地', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  aim: [{ required: true, message: '请选择或输入出境事由', trigger: 'change' }],
  isReport: [{ required: true, message: '请选择是否报备', trigger: 'change' }],
  exitTime: [{ required: true, message: '请选择日期', trigger: 'change' }],
  enterTime: [{ required: true, message: '请选择日期', trigger: 'change' }]
}
