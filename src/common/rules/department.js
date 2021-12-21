export default {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  parent: [
    { required: true, message: '请选择上级部门', trigger: 'blur' }
  ],
  isentity: [
    { required: true, message: '请选择是否为实体部门', trigger: 'blur' }
  ]
}
