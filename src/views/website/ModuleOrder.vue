<template>
  <el-dialog title="模块批量排序" :visible.sync="cpnVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="orderForm" :inline="true" size="medium" label-position="right">
      <el-form-item v-for="item in moduleList" :key="item.id+''" :label="item.title" :prop="item.id+''" label-width="100px">
        <el-input v-model.number="item.order" :style="{ width:'50px' }" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderModule } from '@/api/module'
export default {
  name: 'ModuleOrder',
  props: {
    cpnVisible: {
      type: Boolean,
      default: false
    },
    moduleList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    onSubmit() {
      for (const item of this.moduleList) {
        if (item.order === '') {
          this.$message.error('所有数据不能为空！')
          return
        }
      }
      this.dialogLoading = true
      const tempData = this.moduleList.map(item => { return { id: item.id, order: item.order } })
      console.log(tempData)
      orderModule(tempData).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.dialogLoading = false
        this.$emit('updateOrderSuccess')
      }).catch(err => {
        this.$message.error(err.message)
        this.dialogLoading = false
      })
      this.$message({ message: 'hwhw', type: 'success' })
    },
    onCancel() {
      this.$emit('orderCancel')
      this.$refs.orderForm.resetFields()
      this.$refs.orderForm.clearValidate()
    }
  }
}
</script>

<style>

</style>
