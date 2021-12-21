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
  organId: [
    { required: true, message: '请选择单位', trigger: 'blur' }
  ]
}
