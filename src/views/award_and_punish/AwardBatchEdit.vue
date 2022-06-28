<!--
 * @Author: truxcoder
 * @Date: 2022-05-09 14:54:08
 * @LastEditTime: 2022-05-09 15:45:45
 * @LastEditors: truxcoder
 * @Description: 奖励信息批量录入
-->

<template>
  <el-dialog id="trux-dialog" v-loading="dialogLoading" title="奖励信息批量录入" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="flex">
      <div class=" w-80">
        <el-card>
          <department-tree :expand="expand" @nodeClick="nodeClick" />
        </el-card>
      </div>
      <div class=" flex-1">
        <el-card class=" ml-4">
          <el-transfer v-model="selectData" filterable :titles="titles" :filter-method="filterMethod" :props="props" filter-placeholder="请输入人员姓名" :data="currentData" />
          <div class=" mt-4 font-semibold">
            <h2>人员预览</h2>
          </div>
          <div class=" my-4">
            <el-input :value="finalData" type="textarea" autosize placeholder="已选人员预览" />
          </div>
          <el-form
            v-if="visible"
            ref="editForm"
            :inline="true"
            class="add-form"
            :model="form"
            :rules="rules"
            size="medium"
            :label-width="formLabelWidth"
            label-position="right"
          >
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" :style="formItemWidth" placeholder="请选择分类" @change="onCategoryChange">
                <el-option v-for="i in options.category" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="等级/奖励项" prop="grade">
              <el-select v-model="form.grade" :style="formItemWidth" placeholder="请选择等级/奖励项">
                <el-option v-for="i in gradeList" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="奖励时间" prop="getTime">
              <el-date-picker v-model="form.getTime" :style="formItemWidth" type="date" placeholder="选择日期" />
            </el-form-item>

            <el-form-item label="文号" prop="docNumber">
              <el-input v-model="form.docNumber" :style="formItemWidth" placeholder="输入文号" />
            </el-form-item>

            <el-form-item label="决定机关" prop="organ">
              <el-input v-model="form.organ" :style="formItemWidth" placeholder="输入决定机关" />
            </el-form-item>

            <el-form-item label="奖励内容" prop="content">
              <el-input v-model="form.content" :style="formItemWidth" placeholder="输入奖励内容" />
            </el-form-item>

          </el-form>
        </el-card>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api/index'
import DepartmentTree from '@/components/department/DepartmentTree.vue'
import { common_mixin } from '@/common/mixin/mixin'
import rules from '@/common/rules/award'
const _ = require('lodash/array')

export default {
  name: 'AwardBatchEdit',
  components: { DepartmentTree },
  mixins: [common_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      originData: [], // 原始人员姓名列表
      currentData: [], // 穿梭框左侧待选人员数据
      selectData: [], // 已选择的人员id数组
      existData: [], // 系统已有的考核数据id集，元素为每个考核信息的id
      props: { key: 'id', label: 'name' },
      titles: ['待选人员', '已选人员'],
      dialogWidth: '1200px',
      formLabelWidth: '100px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '280px' },
      formTextAreaWidth: { width: '940px' },
      form: { category: '', getTime: '', grade: '', content: '', docNumber: '', organ: '' },
      rules,
      dialogLoading: false,
      expand: false
    }
  },
  computed: {
    gradeList() {
      return this.options.grade.filter(item => item.category === this.form.category)
    },
    departmentMap() {
      const map = {}
      this.$store.getters.departments.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    personnelMap() {
      const map = {}
      this.originData.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    finalData() {
      return this.selectData.length > 0 ? this.selectData.map(item => this.personnelMap[item].name).join(', ') : '无数据'
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.expand = false
      } else {
        this.currentData = []
        this.selectData = []
        this.existData = []
        this.form = { category: '', getTime: '', grade: '', content: '', docNumber: '', organ: '' }
        this.expand = true
        this.dialogLoading = false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const data = { accountId: this.$store.getters.id, organId: this.$store.getters.organ }
      this.dialogLoading = true
      request('personnel', 'name_list', data).then(response => {
        this.originData = response.data ?? []
        this.dialogLoading = false
      })
    },
    nodeClick(id) {
      const levelCode = this.departmentMap[id]?.levelCode ?? ''
      const dep = this.$store.getters.departments.filter(item => item.levelCode.indexOf(levelCode) > -1).map(item => item.id)
      this.currentData = this.originData.filter(item => dep.includes(item.departmentId))
    },
    filterMethod(query, item) {
      return item.name.indexOf(query) > -1
    },
    onSubmit() {
      if (this.selectData.length === 0) {
        this.$message.warning('不能提交空数据')
        return false
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const data = { personnels: this.selectData, ...this.form }
          // 先提交验证准备录入的考核信息在系统中是否存在
          request('award', 'pre_batch', data)
            .then(response => {
              // 如果存在，则让用户选择是跳过还是覆盖
              if (response.data?.length > 0) {
                this.existData = response.data.map(i => i.id)
                const personnels = response.data.map(i => i.personnelId)
                const diff = _.difference(this.selectData, personnels)
                let message = '检测到以下人员已录入指定时间、指定项目、指定文号的奖励信息。跳过这些人员的信息录入请点击<strong><i>跳过</i></strong>，覆盖这些人员已录入的信息请点击<strong><i>覆盖</i></strong>，取消本次操作请点击右上角<strong><i>关闭</i></strong>按钮。<br />'
                message = message + this.getNameList(personnels)
                this.$confirm(message, '确认信息', {
                  distinguishCancelAndClose: true,
                  customClass: 'trux-message-box',
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: '跳过',
                  cancelButtonText: '覆盖',
                  cancelButtonClass: 'el-button--danger',
                  confirmButtonClass: 'el-button--warning'
                }).then(() => {
                  // 点击跳过只提交新增的信息
                  const _data = { added: diff, ...this.form }
                  request('award', 'batch', _data).then(res => {
                    this.$message.success(res.message)
                    this.dialogLoading = false
                    this.$emit('visibleChange', 'batch')
                  }).catch(error => {
                    console.log(error)
                    this.dialogLoading = false
                  })
                }).catch(action => {
                  // 这里按elmentUI的官方说明用distinguishCancelAndClose: true区分了取消和关闭
                  // 如果是取消，则执行覆盖操作，提交新增信息和修改信息
                  if (action === 'cancel') {
                    const _data = { added: diff, updated: this.existData, ...this.form }
                    request('award', 'batch', _data).then(res => {
                      this.$message.success(res.message)
                      this.dialogLoading = false
                      this.$emit('visibleChange', 'batch')
                    }).catch(error => {
                      console.log(error)
                      this.dialogLoading = false
                    })
                  } else {
                    this.$message.info('取消操作')
                    this.dialogLoading = false
                  }
                })
              } else {
                // 如果不存在，则询问用户是否真的要批量添加
                this.$confirm('确定要批量添加信息吗？', '确认信息', { type: 'warning' }).then(() => {
                  const _data = { added: this.selectData, ...this.form }
                  request('award', 'batch', _data).then(res => {
                    this.$message.success(res.message)
                    this.dialogLoading = false
                    this.$emit('visibleChange', 'batch')
                  }).catch(error => {
                    console.log(error)
                    this.dialogLoading = false
                  })
                }).catch(() => {
                  this.$message.info('已取消操作')
                  this.dialogLoading = false
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.dialogLoading = false
            })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    getNameList(list) {
      return list.length > 0 ? list.map(item => this.personnelMap[item].name).join(', ') : '无数据'
    },
    onCancel() {
      this.$emit('visibleChange', 'batch')
    }
  }
}
</script>

<style lang="scss">
.trux-message-box {
  width: 750px;
}
</style>
