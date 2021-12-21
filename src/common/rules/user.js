export default {
  code: [
    { required: true, message: ' 请输入警号或工号', trigger: 'blur' },
    { min: 4, max: 8, message: '长度在 4到 8 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
  ],
  role_id: [
    { required: true, message: '请选择角色', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { min: 8, max: 11, message: '长度在 2 到 11 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ],
  department_id: [
    { required: true, message: '请选择单位', trigger: 'blur' }
  ]
}
