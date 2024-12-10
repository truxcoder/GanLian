<!--
 * @Author: truxcoder
 * @Date: 2024-04-06 12:55:15
 * @LastEditTime: 2024-04-06 21:31:18
 * @LastEditors: truxcoder
 * @Description: 网站设置
-->
<template>
  <div class="app-container">
    <el-form ref="editForm" v-loading="listLoading" :inline="false" :model="form" size="medium" label-width="200px" label-position="right">
      <el-form-item label="网站标题" prop="title">
        <el-input v-model="form.title" :style="formLineWidth" placeholder="请输入网站标题" />
      </el-form-item>
      <el-form-item label="是否启用成戒所测试" prop="cjs">
        <el-switch v-model="form.cjs" />
      </el-form-item>
    </el-form>
    <div class="foot">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { request } from '@/api/index'
import { list_mixin } from '@/common/mixin/list'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'Setting',
  mixins: [permission_mixin, list_mixin],
  data() {
    return {
      resource: 'setting',
      originData: [],
      currentData: [],
      formLineWidth: { width: '720px' },
      form: { title: '', cjs: false },
    }
  },
  computed: {
    content() {
      return JSON.parse(this.currentData[0]?.content)
      // console.log('[ this.$store ] >', this.$store)
      // return this.$store.state.settings?.setting
    },
  },
  created() {
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}) {
      this.listLoading = true
      request(this.resource, 'list', data).then((response) => {
        this.currentData = response.data || []
        this.setFormData()
        this.listLoading = false
      })
    },
    setFormData() {
      this.form.title = this.content.title ?? ''
      this.form.cjs = this.content.cjs ?? false
    },
    onSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const data = {
            id: this.currentData[0].id,
            title: 'setting',
            content: JSON.stringify(this.form),
          }
          this.listLoading = true
          request(this.resource, 'update', data)
            .then((response) => {
              this.$store.dispatch('settings/changeSettingFromDB')
              this.$message.success(response.message)
              this.listLoading = false
            })
            .catch((err) => {
              console.log(err)
              this.listLoading = false
            })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    onCancel() {
      this.$message.info('用户取消操作')
      this.setFormData()
    },
  },
}
</script>

<style scoped>
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
.foot {
  margin-left: 200px;
}
</style>
