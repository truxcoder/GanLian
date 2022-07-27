/*
 * @Author: truxcoder
 * @Date: 2021-11-10 11:20:14
 * @LastEditTime: 2022-06-29 10:11:37
 * @LastEditors: truxcoder
 * @Description:
 */
export default {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  idCode: [
    { required: true, message: '请输入身份证号码', trigger: 'blur' },
    { min: 15, max: 18, message: '长度在 15 到 18 个字符', trigger: 'blur' }
  ],
  policeCode: [
    { required: true, message: '请输入警号/工号', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  nation: [
    { required: true, message: '请选择民族', trigger: 'change' }
  ],
  political: [
    { required: true, message: '请选择政治面貌', trigger: 'change' }
  ],
  hometown: [
    { required: true, message: '请输入籍贯', trigger: 'blur' }
  ],
  birthplace: [
    { required: true, message: '请输入出生地', trigger: 'blur' }
  ],
  marriage: [
    { required: true, message: '请选择婚姻状况', trigger: 'change' }
  ],
  isSecret: [
    { required: true, message: '请选择是否涉密', trigger: 'change' }
  ],
  startJobDay: [
    { required: true, message: '请选择参加工作日期', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  health: [
    { required: true, message: '请输入健康状况', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  organId: [
    { required: true, message: '请选择单位', trigger: 'blur' }
  ]
}
