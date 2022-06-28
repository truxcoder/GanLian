<!--
 * @Author: truxcoder
 * @Date: 2022-04-26 09:08:56
 * @LastEditTime: 2022-06-14 15:57:19
 * @LastEditors: truxcoder
 * @Description: 考核信息批量录入
-->

<template>
  <el-dialog id="trux-dialog" v-loading="dialogLoading" title="考核信息批量录入" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
            <el-form-item label="考核单位" prop="organ">
              <el-select v-model="form.organ" :style="formItemWidth" filterable allow-create placeholder="请选择或输入单位全称">
                <el-option v-for="i in options.organ" :key="i.id" :label="i.name" :value="i.name" />
              </el-select>
            </el-form-item>

            <el-form-item label="考核年份" prop="years">
              <el-select v-model="form.years" :style="formItemWidth" placeholder="请选择考核年份">
                <el-option v-for="i in options.years" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="考核季度" prop="season">
              <el-select v-model="form.season" :style="formItemWidth" placeholder="请选择考核季度">
                <el-option v-for="i in options.season" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="考核结果" prop="conclusion">
              <el-select v-model="form.conclusion" :style="formItemWidth" placeholder="请选择考核结果">
                <el-option v-for="i in conclusionList" :key="i.value" :label="i.value" :value="i.value" />
              </el-select>
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
import rules from '@/common/rules/appraisal'
import { conclusionDict } from '@/utils/dict'

// const array = require('lodash/array')
const _ = require('lodash/array')

export default {
  name: 'AppraisalBatchEdit',
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
      resource: 'person_train',
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
      form: { organ: '', years: '', season: '', conclusion: '' },
      rules,
      dialogLoading: false,
      expand: false
    }
  },
  computed: {
    conclusionList() {
      return conclusionDict.filter(item => {
        switch (this.form.season) {
          case 100:
            return item.category === 1
          case '':
            return false
          default:
            return item.category === 2
        }
      })
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
        this.form = { organ: '', years: '', season: '', conclusion: '' }
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
          request('appraisal', 'pre_batch', data)
            .then(response => {
              // 如果存在，则让用户选择是跳过还是覆盖
              if (response.data?.length > 0) {
                this.existData = response.data.map(i => i.id)
                const personnels = response.data.map(i => i.personnelId)
                const diff = _.difference(this.selectData, personnels)
                let message = '检测到以下人员已录入指定时间的考核信息。跳过这些人员的信息录入请点击<strong><i>跳过</i></strong>，覆盖这些人员已录入的信息请点击<strong><i>覆盖</i></strong>，取消本次操作请点击右上角<strong><i>关闭</i></strong>按钮。<br />'
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
                  request('appraisal', 'batch', _data).then(res => {
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
                    request('appraisal', 'batch', _data).then(res => {
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
                  request('appraisal', 'batch', _data).then(res => {
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
