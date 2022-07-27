/*
 * @Author: truxcoder
 * @Date: 2021-11-15 16:40:58
 * @LastEditTime: 2022-06-29 10:02:44
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  isLeader: [
    { required: true, message: '请选择是否为领导职务', trigger: 'change' }
  ],
  isChief: [
    { required: true, message: '请选择性质', trigger: 'change' }
  ],
  levelId: [
    { required: true, message: '请选择级别', trigger: 'change' }
  ]
}
