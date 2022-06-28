<!--
 * @Author: truxcoder
 * @Date: 2021-12-13 17:15:04
 * @LastEditTime: 2022-06-24 11:27:05
 * @LastEditors: truxcoder
 * @Description: 个人简历编辑
-->
<template>
  <el-dialog v-loading="dialogLoading" title="编辑干部个人简历" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-card class="mb-4">
      <div class="text-gray-600">
        <ul>
          <li>每行右侧图标的功能是<code class=" text-red-600">向下添加一行</code>和<code class=" text-red-600">删除本行</code></li>
          <li>简历的时间必须连续, 即一条信息的开始时间须与上一条信息的结束时间在同一月</li>
          <li>除最后一条信息外,其他信息起止时间必须填写</li>
          <li>如果单位填“待业”或“转业待安置”, 部门和身份可以留空。否则身份必须填写</li>
          <li>如果同一时间段兼任多个职务, 则在主要职务信息行勾选主任, 兼任职务信息行勾选兼任</li>
        </ul>
      </div>
    </el-card>
    <el-form v-if="visible" ref="addForm" :inline="true" class="add-form" :model="form" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-table :data="currentData" element-loading-text="Loading" border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
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
            <el-input v-model.trim="scope.row.organ" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门" width="220">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.dept" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="职务/身份" width="200">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.post" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="主任" width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.main" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="兼任" width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.cum" />
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot-scope="scope">
            <i class="el-icon-circle-plus cursor-pointer mr-2" @click="handleAdd(scope.$index)" />
            <i class="el-icon-delete cursor-pointer" @click="handleDelete(scope.$index)" />
            <!-- <el-tooltip class="mr-2" placement="top" content="向下插入一行">
              <i class="el-icon-circle-plus cursor-pointer" @click="handleAdd(scope.$index)" />
            </el-tooltip>
            <el-tooltip class="mr-2" placement="top" content="删除本行">
              <i class="el-icon-delete cursor-pointer" @click="handleDelete(scope.$index)" />
            </el-tooltip> -->
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
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
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
      form: { personnelId: '', role: '' },
      dialogWidth: '1200px',
      formLabelWidth: '160px',
      formItemWidth: { width: '140px' },
      formTextAreaWidth: { width: '940px' },
      multipleSelection: [],
      loading: false,
      dialogLoading: false,
      originData: [],
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
        this.originData = cloneDeep(this.currentData)
      } else {
        this.currentData = []
        this.originData = []
      }
    }
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      if (isEqual(this.currentData, this.originData)) {
        this.$message.info('未修改任何数据')
        this.$emit('visibleChange', 'resume')
        return false
      }
      if (!this.validate()) {
        return false
      }
      const temp = JSON.stringify(this.currentData)
      let result
      if (!this.can?.manage) {
        const data = {
          personnelId: this.personnelId,
          organId: this.$store.getters.organ,
          category: 3,
          content: temp
        }
        result = request('pre', null, data)
      } else {
        result = request('personnel', 'resume', { personnelId: this.personnelId, content: temp })
      }
      // request('personnel', 'resume', { personnelId: this.personnelId, content: temp })
      result.then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$emit('editSuccess', 'resume')
      })
        .catch(err => {
          console.log(err)
        })
    },
    handleAdd(index) {
      // const temp = { start: '', end: '', organ: '', dept: '', post: '' }
      const temp = { start: this.currentData[index].end, end: '', organ: '', dept: '', post: '' }
      this.currentData.splice(index + 1, 0, temp)
    },
    handleDelete(index) {
      this.currentData.splice(index, 1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    },
    organValidate(organ) {
      const validList = ['待业', '待安置']
      return validList.some(i => organ.includes(i))
    },
    /**
     * @description: 简历提交时各条信息起止时间验证
     * @param {*}
     * @return {*}
     */
    timeValidate() {
      const length = this.currentData.length
      // 循环遍历currentData，确保所有元素符合要求
      return this.currentData.every((value, index, array) => {
        // 如果当前元素包含cum属性且cum属性为false，则删除此属性
        if ('cum' in value && !value.cum) {
          this.$delete(value, 'cum')
        }
        // 如果当前元素包含main属性且main属性为false，则删除此属性
        if ('main' in value && !value.main) {
          this.$delete(value, 'main')
        }
        // 如果首行的cum属性为真，报错返回
        if (index === 0 && 'cum' in value) {
          this.$message.error('首条信息不能为兼任信息!')
          return false
        }
        // 如果最后一行的main属性为真，报错返回
        if (index === length - 1 && 'main' in value) {
          this.$message.error('最后一条信息不能为主任信息!')
          return false
        }
        // 一条信息同时包含main和cum属性，报错返回
        if ('cum' in value && 'main' in value) {
          this.$message.error('一条信息不能同时为主任信息和兼任信息!')
          return false
        }
        // 一条信息main为真，即勾选了主任，而下一条未勾选兼任，则报错返回
        if ('main' in value && !('cum' in array[index + 1])) {
          this.$message.error('兼任信息与主任信息不匹配!')
          return false
        }
        if ('cum' in value) {
          let isMainFound = false
          // 一条信息勾选了兼任，则向前迭代，直到找到包含main的信息，即勾选了主任的信息，且在迭代过程中
          // 除了main那一行，其他所有行必须勾选兼任。且所有行的起止时间必须相同。
          for (let i = index; i >= 0; i--) {
            if ('main' in array[i]) {
              if (value.start !== array[i].start || value.end !== array[i].end) {
                this.$message.error('兼任信息的起止时间必须相同!')
                return false
              }
              isMainFound = true
              break
            }
            if (!('cum' in array[i])) {
              this.$message.error('兼任信息与主任信息不匹配!')
              return false
            }
            if (value.start !== array[i].start || value.end !== array[i].end) {
              this.$message.error('兼任信息的起止时间必须相同!')
              return false
            }
          }
          if (!isMainFound) {
            this.$message.error('兼任信息与主任信息不匹配!')
            return false
          }
          return true
        }
        if (index !== 0 && value.start !== array[index - 1].end) {
          this.$message.error('简历多条记录起止时间必须连续!')
          return false
        }
        return true
      })
    },
    validate() {
      let isValid = 1
      this.currentData.every(item => {
        if (item.start === 'null' || item.start === null) {
          item.start = ''
        }
        if (item.end === 'null' || item.end === null) {
          item.end = ''
        }
        if (item.organ === '') {
          isValid = 0
          return false
        }
        if (item.start === '' || (item.post === '' && !this.organValidate(item.organ))) {
          isValid = 0
          return false
        }
        if (item.start !== '' && item.end !== '') {
          const start = new Date(item.start)
          const end = new Date(item.end)
          if (start > end) {
            isValid = -2
            return false
          }
        }
        Object.values(item).every(i => {
          if (i && Object.prototype.toString.call(i) !== '[object Boolean]' && (i.includes('#') || i.includes('$'))) {
            isValid = -1
            return false
          }
          return true
        })
        if (isValid === -1) {
          return false
        }
        return true
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
      // this.currentData.sort((a, b) => dayjs(a.start).unix() - dayjs(b.start).unix())
      const length = this.currentData.length
      if (length > 1) {
        return this.timeValidate()
      }
      return true
    }
  }
}
</script>

<style></style>
