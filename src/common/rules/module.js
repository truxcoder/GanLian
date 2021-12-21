export default {
  title: [
    { required: true, message: ' 请输入模块名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2到 10 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入模块标签', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  rank: [
    { required: true, message: '请选择模块级别', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入路径', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请选择图标', trigger: 'blur' }
  ],
  parent: [
    { required: true, message: '请选择父模块', trigger: 'blur' }
  ],
  order: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ]
}
