<!--
 * @Author: truxcoder
 * @Date: 2022-09-21 09:43:40
 * @LastEditTime: 2023-04-28 10:56:07
 * @LastEditors: truxcoder
 * @Description: 干部队伍分析
-->
<template>
  <div class="app-container">
    <el-card v-if="can.global">
      <div>
        <el-button v-for="(v, k) in organs" :key="k" size="small" type="success" :plain="v.id !== currentOrgan.id" @click="onChangeOrgan(v)">{{ v.shortName }}</el-button>

      </div>
    </el-card>

    <el-card class=" mt-4">
      <div slot="header">
        <span class=" font-bold">总体描述</span>
      </div>
      <div class="w-full">
        <div v-html="getOverviewString()" />
      </div>
    </el-card>

    <el-card class=" mt-4">
      <div slot="header">
        <span class=" font-bold">编制结构</span>
      </div>
      <div class="w-full">
        <div v-html="getHeadcountString()" />
      </div>
    </el-card>

    <el-card class=" mt-4">
      <div slot="header">
        <span class=" font-bold">年龄结构</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="w-full">
        <div v-html="getAgeString()" />
        <div class="w-full flex h-96 mt-4">
          <div id="age-overview" class="w-1/2">年龄概况</div>
          <div id="age-distribution" class="flex-1">年龄分布</div>
        </div>
      </div>
    </el-card>

    <el-card class=" mt-4">
      <div slot="header">
        <span class=" font-bold">学历结构</span>
      </div>
      <div class="w-full">
        <div v-html="getEduString()" />
        <div class="w-full flex h-96 mt-4 justify-between">
          <div id="edu-all" class=" w-1/3 h-96">整体学历</div>
          <div id="edu-zk" class="w-1/3 h-96">正科级干部</div>
          <div id="edu-fk" class="w-1/3 h-96">副科级干部</div>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import * as analysisMethods from './analysisMethods'

import * as echarts from 'echarts'
import { isEmpty } from 'lodash/lang'

export default {
  name: 'PoliceTeam',
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      resource: 'analysis',
      originData: '',
      currentData: {},
      currentOrgan: {},
      departments: []
    }
  },
  computed: {
    organs() {
      return this.$store.getters.organs.filter(i => i.shortName !== '攀枝花所' && i.shortName !== '泸州所')
    },
    currentOverviewData() {
      return this.currentData['overview'][this.currentOrgan.id]
    },
    currentAgeData() {
      return this.currentData['age'][this.currentOrgan.id]
    },
    currentEduData() {
      return this.currentData['edu'][this.currentOrgan.id]
    },
    departmentMap() {
      const temp = {}
      this.departments.forEach(i => {
        temp[i.id] = JSON.parse(isEmpty(i.position) ? '{}' : i.position)
      })
      return temp
    },
    currentHeadcountData() {
      return this.departmentMap[this.currentOrgan.id]
    },
    ageOverviewOption() {
      const v = this.currentAgeData
      return analysisMethods.getAgeOverviewOption(v)
    },
    ageDisOption() {
      const v = this.currentAgeData
      return analysisMethods.getAgeDisOption(v)
    },
    eduAllOption() {
      const v = this.currentEduData
      const overview = this.currentOverviewData
      return analysisMethods.getEduAllOption(v, overview)
    },
    eduZkOption() {
      const v = this.currentEduData
      const overview = this.currentOverviewData
      return analysisMethods.getEduZkOption(v, overview)
    },
    eduFkOption() {
      const v = this.currentEduData
      const overview = this.currentOverviewData
      return analysisMethods.getEduFkOption(v, overview)
    }
  },
  created() {
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      request(this.resource, 'police').then(response => {
        this.originData = response.data
        this.departments = response.department
        this.currentData = JSON.parse(this.originData)
        this.currentOrgan = this.organs[0]
        if (!this.can.global && this.organs.map(i => i.id).includes(this.$store.getters.organ)) {
          for (const i of this.organs) {
            if (i.id === this.$store.getters.organ) {
              this.currentOrgan = i
              break
            }
          }
        }
        // 需要等页面DOM渲染完毕之后才能初始化编辑器，所以这里用了nextTick
        this.$nextTick(() => {
          this.mountCharts()
          this.setOption()
        })

        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    mountCharts() {
      echarts.init(document.getElementById('age-overview'))
      echarts.init(document.getElementById('age-distribution'))
      echarts.init(document.getElementById('edu-all'))
      echarts.init(document.getElementById('edu-zk'))
      echarts.init(document.getElementById('edu-fk'))
    },
    setOption() {
      const ageOverviewCharts = echarts.getInstanceByDom(document.getElementById('age-overview'))
      const ageDisCharts = echarts.getInstanceByDom(document.getElementById('age-distribution'))
      const eduAllCharts = echarts.getInstanceByDom(document.getElementById('edu-all'))
      const eduZkCharts = echarts.getInstanceByDom(document.getElementById('edu-zk'))
      const eduFkCharts = echarts.getInstanceByDom(document.getElementById('edu-fk'))
      ageOverviewCharts.setOption(this.ageOverviewOption)
      ageDisCharts.setOption(this.ageDisOption)
      eduAllCharts.setOption(this.eduAllOption)
      eduZkCharts.setOption(this.eduZkOption)
      eduFkCharts.setOption(this.eduFkOption)
    },
    onChangeOrgan(v) {
      this.currentOrgan = v
      this.setOption()
    },
    getOverviewString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData['overview']).length === 0) {
        return ''
      }
      const v = this.currentOverviewData
      const age = this.currentAgeData
      const edu = this.currentEduData
      return analysisMethods.getOverviewString(this.currentOrgan, v, age, edu)
    },
    getHeadcountString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData['overview']).length === 0) {
        return ''
      }
      return analysisMethods.getHeadcountString(this.currentOrgan, this.currentHeadcountData, this.currentOverviewData)
    },
    getAgeString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData['age']).length === 0) {
        return ''
      }
      const v = this.currentAgeData
      return analysisMethods.getAgeString(this.currentOrgan, v)
    },
    getEduString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData['age']).length === 0) {
        return ''
      }
      const v = this.currentEduData
      const overview = this.currentOverviewData
      return analysisMethods.getEduString(this.currentOrgan, v, overview)
    }
  }

}
</script>

<style scoped>
.edu-chart-div{
  height: 32rem;
  width: 33%;
}
</style>
