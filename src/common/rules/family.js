/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:22:20
 * @LastEditTime: 2022-05-19 11:41:20
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  relation: [{ required: true, message: '请选择称谓', trigger: 'change' }],
  birthday: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  political: [{ required: true, message: '请选择政治面貌', trigger: 'change' }],
  organ: [{ required: true, message: '请输入单位', trigger: 'change' }],
  isAbroad: [{ required: true, message: '请选择是或否', trigger: 'change' }]
}
