<!--
 * @Author: truxcoder
 * @Date: 2022-02-15 10:13:03
 * @LastEditTime: 2022-03-03 10:53:17
 * @LastEditors: truxcoder
 * @Description: 管理举报处理步骤, 本dialog又嵌套了添加和修改dialog。子dialog用了append-to-body属性，子组件取消或完成动作emit到本组件，
 ****************本组件又emit给上级父组件，由上级组件修改visible，然后再一层层传递到子组件
-->
<template>
  <el-dialog v-loading="dialogLoading" title="管理举报处理步骤" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <h1 v-if="!steps.length">无步骤信息</h1>
    <el-timeline v-if="steps.length">
      <el-timeline-item v-for="(item, index) in steps" :key="index" :timestamp="item.time" placement="top" :color="item.color" :type="index === 0 ? 'success' : 'info'">
        <el-card>
          <div class="flex items-center">
            <div class="font-semibold">
              <span>{{ item.step | stepFilter }}</span>
            </div>
            <div class=" pl-2 self-center ">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit('update', index)" />
              <el-button type="text" size="small" icon="el-icon-delete" @click="onDelete(index)" />
            </div>
          </div>
          <div>{{ item.content }}</div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <ReportStepEdit :visible="editVisible" :action="action" :options="options" :row="row" :steps="steps" :index="currentIndex" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="handleEdit('add')">添加步骤</el-button>
      <el-button @click="onCancel">关 闭</el-button>
      <!-- <el-button type="primary" @click="onSubmit">确 定</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { request, curd } from '@/api/index'
import ReportStepEdit from './ReportStepEdit.vue'
var lang = require('lodash/lang')
export default {
  name: 'ReportStep',
  components: { ReportStepEdit },
  filters: {
    personList(arr) {
      if (!arr) {
        return '无'
      }
      return arr.map(item => item.name).join(', ')
    },
    stepFilter(step) {
      let result
      switch (step) {
        case 1:
          result = '谈话函询阶段'
          break
        case 2:
          result = '初步核查阶段'
          break
        case 3:
          result = '立案查询调查阶段'
          break
        case 100:
          result = '调查完结(属实)'
          break
        case 99:
          result = '调查完结(不属实)'
          break

        default:
          result = '未定义'
          break
      }
      return result
    }
  },
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
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    editVisible: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      resource: 'report',
      steps: [],
      dialogWidth: '1200px',
      formLabelWidth: '140px',
      formLineWidth: { width: '940px' },
      formItemWidth: { width: '395px' },
      formTextAreaWidth: { width: '940px' },
      currentIndex: 0,
      action: '',
      loading: false,
      dialogLoading: false
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.fetchData()
      } else {
        this.steps = []
      }
    }
  },
  methods: {
    fetchData() {
      request(this.resource, 'steps', { id: this.row.id }).then(res => {
        const temp = res.data.steps ?? ''
        if (temp !== '') {
          this.steps = JSON.parse(temp)
        }
      })
    },
    handleEdit(act, index) {
      this.action = act
      if (act === 'add') {
        this.currentIndex = 0
      } else {
        this.currentIndex = index
      }
      this.$emit('stepVisibleChange')
    },
    onDelete(index) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const steps = lang.cloneDeep(this.steps)
          steps.splice(index, 1)
          const data = { id: this.row.id, steps: JSON.stringify(steps) }
          const params = { resource: this.resource }
          curd('update', data, params)
            .then(response => {
              this.$message.success(response.message)
              this.fetchData()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    editSuccess() {
      this.fetchData()
      this.$emit('stepVisibleChange')
    },
    visibleChange(cpn) {
      this.$emit('stepVisibleChange', cpn)
    },
    onCancel() {
      this.$emit('visibleChange', 'step')
    }
  }
}
</script>

<style></style>
