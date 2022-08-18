<!--
 * @Author: truxcoder
 * @Date: 2022-08-15 10:56:00
 * @LastEditTime: 2022-08-16 10:10:23
 * @LastEditors: truxcoder
 * @Description: 数据导出字段勾选，用到了sheetJS
-->
<template>
  <el-dialog v-loading="loading" title="请勾选需要导出的字段" width="1000px" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;" />
      <el-checkbox-group v-model="checkedFields" class=" leading-5" @change="handleCheckedFieldsChange">
        <el-checkbox v-for="field in fields" :key="field.value" :label="field.value">{{ field.label }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as XLSX from 'xlsx'
import { request } from '@/api'
import dayjs from 'dayjs'
import { passportDict } from '@/utils/dict'

export default {
  name: 'PersonnelDataExport',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    all: {
      type: Array,
      default() {
        return []
      }
    },
    can: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      checkAll: false,
      checkedFields: [],
      fields: [
        { label: '单位', value: 'organName' },
        { label: '部门', value: 'departmentName' },
        { label: '姓名', value: 'name' },
        { label: '性别', value: 'gender' },
        { label: '民族', value: 'nation' },
        { label: '身份证号码', value: 'idCode' },
        { label: '出生日期', value: 'birthday' },
        { label: '警号', value: 'policeCode' },
        { label: '政治面貌', value: 'political' },
        { label: '入党日期', value: 'joinPartyDay' },
        { label: '参工日期', value: 'startJobDay' },
        { label: '全日制教育学历', value: 'fullTimeEdu' },
        { label: '全日制教育学位', value: 'fullTimeDegree' },
        { label: '全日制教育专业', value: 'fullTimeMajor' },
        { label: '全日制教育毕业院校', value: 'fullTimeSchool' },
        { label: '在职教育学历', value: 'partTimeEdu' },
        { label: '在职教育学位', value: 'partTimeDegree' },
        { label: '在职教育专业', value: 'partTimeMajor' },
        { label: '在职教育毕业院校', value: 'partTimeSchool' },
        { label: '最高教育学历', value: 'finalEdu' },
        { label: '最高教育学位', value: 'finalDegree' },
        { label: '最高教育专业', value: 'finalMajor' },
        { label: '最高教育毕业院校', value: 'finalSchool' },
        { label: '录警日期', value: 'bePoliceDay' },
        { label: '专业证书', value: 'proCert' },
        { label: '岗位是否涉密', value: 'isSecret' },
        { label: '通过县处级考试时间', value: 'passExamDay' },
        { label: '持有护照情况', value: 'passport' },
        { label: '联系电话', value: 'phone' },
        { label: '籍贯', value: 'hometown' },
        { label: '出生地', value: 'birthplace' },
        { label: '健康状况', value: 'health' },
        { label: '专业技术职务', value: 'technicalTitle' },
        { label: '专长', value: 'specialty' },
        { label: '婚姻状况', value: 'marriage' }
      ],
      isIndeterminate: true,
      dialogWidth: '900px',
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      const data = { id: this.all.map(i => i.id) }
      request('personnel', 'export_list', data).then(response => {
        if (response.data.length) {
          // sheetData，excel数据源。为二维数组，亦可为json。
          const sheetData = response.data.map(i => {
            const temp = []
            this.checkedFields.forEach(item => { temp.push(this.cleanCellData(i, item)) })
            return temp
          })
          // 实例化一个工作簿
          const book = XLSX.utils.book_new()
          // 实例化一个Sheet
          const header = this.fields.filter(item => this.checkedFields.includes(item.value)).map(item => item.label)
          const sheet = XLSX.utils.aoa_to_sheet(sheetData, {
            origin: 1 // 从第二行开始写内容，第一行留给标题栏
            // origin is expected to be one of:
            // (cell object)	Use specified cell (cell object)
            // (string)	Use specified cell (A1-style cell)
            // (number >= 0)	Start from the first column at specified row (0-indexed)
            // -1	Append to bottom of worksheet starting on first column
            // (default)	Start from cell A1
            // skipHeader: true
          })
          XLSX.utils.sheet_add_aoa(sheet, [header]) // 写入标题栏
          // 将Sheet写入工作簿
          XLSX.utils.book_append_sheet(book, sheet, 'Sheet1')
          // 写入文件，直接触发浏览器的下载
          XLSX.writeFile(book, '人员数据.xlsx')
          this.loading = false
        } else {
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleCheckAllChange(val) {
      this.checkedFields = val ? this.fields.map(i => i.value) : []
      this.isIndeterminate = false
    },
    handleCheckedFieldsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.fields.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fields.length
    },
    /**
     * 规范化excel表格数据格式
     */
    cleanCellData(row, key) {
      const dayFields = ['birthday', 'bePoliceDay', 'passExamDay']
      const monthFields = ['joinPartyDay', 'startJobDay']
      if (dayFields.includes(key)) {
        if (dayjs(row[key]).year() === 1) {
          return ''
        }
        return dayjs(row[key]).format('YYYY-MM-DD')
      }
      if (monthFields.includes(key)) {
        if (dayjs(row[key]).year() === 1) {
          return ''
        }
        return dayjs(row[key]).format('YYYY-MM')
      }
      if (key === 'passport') {
        const passport = row[key] ?? ''
        if (passport === '') {
          return '无'
        }
        const _map = new Map()
        passportDict.forEach(i => {
          _map.set(i.value, i.label)
        })
        const temp = JSON.parse(passport)
        if (Array.isArray(temp)) {
          return temp.map(i => _map.get(i)).join(', ')
        }
        return '错误'
      }
      if (key === 'isSecret') {
        return row[key] ? (row[key] === 2 ? '是' : '否') : ''
      }
      return row[key]
    },
    onCancel() {
      this.checkedFields = []
      this.checkAll = false
      this.isIndeterminate = true
      this.$emit('visibleChange', 'export')
      // this.visible = false
    }
  }

}
</script>

<style>

</style>
