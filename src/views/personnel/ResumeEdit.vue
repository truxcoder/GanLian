<!--
 * @Author: truxcoder
 * @Date: 2021-12-13 17:15:04
 * @LastEditTime: 2022-01-27 14:34:20
 * @LastEditors: truxcoder
 * @Description: 个人简历编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" title="编辑干部个人简历" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-table :data="currentData" element-loading-text="Loading" border :fit="true" highlight-current-row>
        <el-table-column align="center" label="开始日期" width="165">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.start" :style="formItemWidth" type="month" value-format="yyyy-MM-dd" placeholder="选择日期" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束日期" width="165">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.end" :style="formItemWidth" type="month" value-format="yyyy-MM-dd" placeholder="选择日期" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.organ" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门" width="220">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dept" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="职务/身份" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.post" />
          </template>
        </el-table-column>
        <el-table-column align="center" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete cursor-pointer" @click="handleDelete(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onAdd">增加条目</el-button>
      <el-button type="success" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api'
import dayjs from 'dayjs'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    personnelId: {
      type: String,
      default() {
        return ''
      }
    },
    resume: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      form: { personnelId: '', role: '' },
      dialogWidth: '1200px',
      formLabelWidth: '160px',
      formItemWidth: { width: '140px' },
      formTextAreaWidth: { width: '940px' },
      loading: false,
      dialogLoading: false,
      currentData: []
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        if (this.resume === '') {
          this.currentData = []
          return
        }
        this.currentData = JSON.parse(this.resume)
        this.currentData.sort((a, b) => dayjs(a.start).unix() - dayjs(b.start).unix())
      } else {
        this.currentData = []
      }
    }
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      let isValid = 1
      this.currentData.forEach(item => {
        console.log(`start:${item.start}, end:${item.end}`)
        if (item.start === 'null') {
          item.start = ''
        }
        if (item.end === 'null') {
          item.end = ''
        }
        if (item.organ === '') {
          isValid = 0
          return
        }
        if (item.start === '' || (item.post === '' && item.organ !== '待业')) {
          isValid = 0
          return
        }
        if (item.start !== '' && item.end !== '') {
          const start = new Date(item.start)
          const end = new Date(item.end)
          if (start > end) {
            isValid = -2
            return
          }
        }
        Object.values(item).forEach(i => {
          if (i.includes('#') || i.includes('$')) {
            isValid = -1
          }
        })
      })
      if (isValid === 0) {
        this.$message.error('必填字段不能为空')
        return false
      }
      if (isValid === -1) {
        this.$message.error('所填写项目中不能包含"#"、"$"等非法字符')
        return false
      }
      if (isValid === -2) {
        this.$message.error('开始时间不能大于结束时间!')
        return false
      }
      this.currentData.sort((a, b) => dayjs(a.start).unix() - dayjs(b.start).unix())
      let currentIndex = 0
      const length = this.currentData.length
      if (length > 1) {
        this.currentData.forEach(item => {
          if (currentIndex !== 0) {
            if (item.start !== this.currentData[currentIndex - 1].end) {
              isValid = -2
              return
            }
          }
          currentIndex++
        })
      }
      if (isValid === -2) {
        this.$message.error('简历多条记录起止时间必须连续!')
        return false
      }

      // const result = this.currentData.map(item => item.start + '#' + item.end + '#' + item.organ + '#' + item.dept + '#' + item.post)
      // const temp = result.join('$')
      const temp = JSON.stringify(this.currentData)
      // personnelUpdate({ id: this.personnelId, resume: temp })
      request('personnel', 'resume', { personnelId: this.personnelId, content: temp })
        .then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.$emit('editSuccess')
          // Object.keys(this.form).forEach(key => this.form[key]='')
        })
        .catch(err => {
          // this.$message.error(err.message)
          console.log(err)
        })
    },
    handleDelete(index) {
      this.currentData.splice(index, 1)
    },
    onAdd() {
      const temp = { start: '', end: '', organ: '', dept: '', post: '' }
      this.currentData.push(temp)
    },
    onCancel() {
      this.$emit('visibleChange', 'resume')
      // Object.keys(this.form).forEach(key => this.form[key]='')
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
    }
  }
}
</script>

<style></style>
