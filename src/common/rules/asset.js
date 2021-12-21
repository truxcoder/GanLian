export default {
  code: [
    { required: true, message: '请输入编号', trigger: 'blur' },
    { min: 10, max: 12, message: '长度在 10 到 12 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入资产名称', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  brand: [
    { required: true, message: '请输入品牌', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  product_model: [
    { required: true, message: '请输入型号，无型号请填未知', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ],
  manager: [
    { required: true, message: '请输入责任人', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  department_id: [
    { required: true, message: '请选择单位', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入所在位置', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  scrap_year: [
    { type: 'number', required: true, message: '请输入数字', trigger: 'change' }
  ],
  price: [
    { type: 'number', required: true, message: '请输入数字', trigger: 'change' }
  ],
  buy_time: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ],
  use_time: [
    { required: true, message: '请选择时间', trigger: 'change' }
  ]
}
