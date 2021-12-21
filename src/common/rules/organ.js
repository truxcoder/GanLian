export default {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  shortName: [
    { required: true, message: '请输入简称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  parent: [
    { required: true, message: '请选择上级单位', trigger: 'change' }
  ],
  authorizedSize: [
    { required: true, message: '请输入编制数', trigger: 'blur' },
    { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
  ],
  order: [
    { required: true, message: '请输入排序', trigger: 'blur' },
    { type: 'number', message: '输入内容只能为数字', trigger: 'blur' }
  ]
}
