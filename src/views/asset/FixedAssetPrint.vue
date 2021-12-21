<template>
  <el-dialog
    v-loading="dialogLoading"
    title="打印资产卡片"
    width="230mm"
    center
    :visible="dialogPrintVisible"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
  >
    <div class="outside">
      <div id="asset-card">
        <h1>四川省资阳强制隔离戒毒所固定资产资料详表</h1>
        <div class="code-zone">
          <span>报表日期：{{ today }}</span>
          <span>制表人：{{ rowdata.manager }}</span>
        </div>
        <table class="print-zone">
          <!-- <tr>
            <th></th>
            <th>Savings</th>
          </tr> -->
          <tr>
            <td>名称</td>
            <td>{{ rowdata.name }}</td>
            <td>编号</td>
            <td>{{ rowdata.code }}</td>
          </tr>
          <tr>
            <td>品牌</td>
            <td>{{ rowdata.mfrs }}</td>
            <td>型号</td>
            <td>{{ rowdata.model }}</td>
          </tr>
          <tr>
            <td>所属部门</td>
            <td>{{ rowdata.department?rowdata.department.name:'无' }}</td>
            <td>所在位置</td>
            <td>{{ rowdata.position }}</td>
          </tr>
          <tr>
            <td>购买价格</td>
            <td>￥{{ rowdata.price }}元</td>
            <td>报废期限</td>
            <td>{{ rowdata.scrap_year }}年</td>
          </tr>
          <tr>
            <td>购买日期</td>
            <td>{{ rowdata.buy_time }}</td>
            <td>启用日期</td>
            <td>{{ rowdata.use_time }}</td>
          </tr>
          <tr>
            <td>当前状态</td>
            <td>{{ rowdata.status }}</td>
            <td>责任人</td>
            <td>{{ rowdata.manager }}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">打 印</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import printJS from 'print-js'
import dayjs from 'dayjs'
export default {
  name: 'FixedAssetPrint',
  props: {
    dialogPrintVisible: { type: Boolean, default: false },
    rowdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  // computed: {
  //   visible() {
  //     return this.dialogPrintVisible
  //   }
  // },
  data() {
    return {
      dialogLoading: false,
      today: dayjs().format('YYYY年MM月DD日')
    }
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onClose() {
      this.$emit('printVisibleChange')
    },
    onSubmit() {
      // this.dialogLoading = true
      const that = this
      printJS({
        printable: 'asset-card',
        type: 'html',
        targetStyles: ['*'],
        style: '@page { margin: 0; } body { margin: 0px 0px;}'
        // onPrintDialogClose:()=>{
        //   that.$message({
        //     type: 'info',
        //     message: '取消打印！'
        //   })
        // }
      })
    },
    onCancel() {
      this.$emit('printVisibleChange')
      // Object.keys(this.form).forEach(key => this.form[key]='')
      // this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style scoped>
.outside {
  text-align: center;
  width: 100%;
}
#asset-card {
  /* border:1px solid #666;
  width: 500px;
  height: 300px; */
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  text-align: center;
}
/* @media print{
  @page
    {
      size: auto;
      margin: 0mm;
    }
} */
@page {
  size: A4;
  margin: 0;
  text-align: center;
}
/* @media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
} */
.print-zone {
  width: 90%;
  margin: 5mm auto;
  border: 1px solid #666;
  border-collapse: collapse;
}
.print-zone tr {
  height: 10mm;
}
.print-zone td {
  border: 1px solid #666;
}
.code-zone {
  display: flex;
}
.code-zone span {
  flex: 1;
  justify-content: space-around;
}
</style>
