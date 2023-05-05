/*
 * @Author: truxcoder
 * @Date: 2021-11-15 16:40:58
 * @LastEditTime: 2023-04-05 15:06:49
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  organId: [{ required: true, message: '请选择或输入单位', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择职务', trigger: 'change' }],
  isBoss: [
    { required: true, message: '请选择是否为一把手', trigger: 'change' }
  ],
  isChief: [
    { required: true, message: '请选择是否为正职', trigger: 'change' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
    { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
  ]
}
