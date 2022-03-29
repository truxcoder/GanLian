/*
 * @Author: truxcoder
 * @Date: 2021-11-16 12:48:28
 * @LastEditTime: 2022-03-16 16:51:28
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  personnelId: [{ required: true, message: '请选择人员', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  intro: [{ required: true, message: '请输入事件简介', trigger: 'change' }]
}
