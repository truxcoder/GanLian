<!--
 * @Author: truxcoder
 * @Date: 2022-02-08 10:24:13
 * @LastEditTime: 2022-04-19 21:34:14
 * @LastEditors: truxcoder
 * @Description: 培训选择人员页面
-->

<template>
  <el-dialog v-loading="dialogLoading" :title="row.title" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
          <div class=" mt-4">
            <el-input :value="finalData" type="textarea" autosize placeholder="已选人员预览" />
          </div>
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
import { request, curd } from '@/api/index'
import DepartmentTree from '@/components/department/DepartmentTree.vue'
import { common_mixin } from '@/common/mixin/mixin'

// const array = require('lodash/array')
const _ = require('lodash')

export default {
  name: 'TrainingPersonnel',
  components: { DepartmentTree },
  mixins: [common_mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
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
      originTrainData: [], // 讲求过来的原始人员参与培训数据。[{personnelId:11111, trainId:2222}]
      currentData: [], // 穿梭框左侧待选人员数据
      selectData: [], // 已选择的人员id数组
      remoteData: [], // 数据库请求过来的原始已选择数据
      props: { key: 'id', label: 'name' },
      titles: ['待选人员', '已选人员'],
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' },
      dialogLoading: false,
      expand: false
    }
  },
  computed: {
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
        request('training', 'person_list', { id: this.row.id }).then(res => {
          // console.log('---res:', res)
          this.originTrainData = res.data ?? []
          if (this.originTrainData.length > 0) {
            this.remoteData = this.originTrainData.map(item => item.personnelId)
            this.selectData = [...this.remoteData]
          }
        })
      } else {
        this.originTrainData = []
        this.currentData = []
        this.remoteData = []
        this.selectData = []
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
        // this.currentData = this.originData.length ? [...this.originData] : []
        this.dialogLoading = false
      })
    },
    nodeClick(id) {
      console.log('---id:', id)
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
      this.dialogLoading = true
      const added = _.difference(this.selectData, this.remoteData)
      const deled = _.difference(this.remoteData, this.selectData)
      if (added.length === 0 && deled.length === 0) {
        this.$message.warning('未修改任何数据')
        this.dialogLoading = false
        return false
      }
      if (added.length > 0 && deled.length > 0) {
        const addData = added.map(item => {
          return { personnelId: item, trainId: this.row.id }
        })
        const delData = this.originTrainData.filter(item => deled.includes(item.personnelId)).map(item => item.id)
        Promise.all([request('training', 'add', addData), curd('delete', { id: delData }, { resource: this.resource })]).then(response => {
          this.$message.success(response[0].message + ' ' + response[1].message)
          this.dialogLoading = false
          this.$emit('visibleChange', 'personnel')
        })
      } else if (added.length > 0) {
        const addData = added.map(item => {
          return { personnelId: item, trainId: this.row.id }
        })
        request('training', 'add', addData).then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('visibleChange', 'personnel')
        })
      } else if (deled.length > 0) {
        const delData = this.originTrainData.filter(item => deled.includes(item.personnelId)).map(item => item.id)
        curd('delete', { id: delData }, { resource: this.resource }).then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('visibleChange', 'personnel')
        })
      } else {
        this.$message.warning('有错误发生!')
        this.dialogLoading = false
        return false
      }
    },
    onCancel() {
      this.$emit('visibleChange', 'personnel')
    }
  }
}
</script>

<style></style>
