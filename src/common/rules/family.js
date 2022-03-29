/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:22:20
 * @LastEditTime: 2022-03-16 21:16:16
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  relation: [{ required: true, message: '请选择关系', trigger: 'change' }],
  political: [{ required: true, message: '请选择政治面貌', trigger: 'change' }],
  organ: [{ required: true, message: '请输入单位', trigger: 'change' }],
  isAbroad: [{ required: true, message: '请选择是或否', trigger: 'change' }]
}
