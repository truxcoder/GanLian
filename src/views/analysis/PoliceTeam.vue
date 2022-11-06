<!--
 * @Author: truxcoder
 * @Date: 2022-09-21 09:43:40
 * @LastEditTime: 2022-09-23 10:50:48
 * @LastEditors: truxcoder
 * @Description: 干部队伍分析
-->
<template>
  <div class="app-container">
    <el-card>
      <div>
        <el-button v-for="(v, k) in organs" :key="k" size="small" type="success" :plain="v.id !== currentOrgan.id" @click="onChangeOrgan(v)">{{ v.shortName }}</el-button>

      </div>
    </el-card>
    <el-card class=" mt-4">
      <div slot="header">
        <span>年龄结构</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="w-full">
        <div v-html="getAgeString()" />
        <div id="ageChart" class=" h-96 w-1/2 mt-4">aaa</div>

      </div>
    </el-card>

  </div>
</template>

<script>
import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'

import * as echarts from 'echarts'

export default {
  name: 'PoliceTeam',
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      resource: 'analysis',
      originData: '',
      currentData: [],
      currentOrgan: {}
    }
  },
  computed: {
    organs() {
      return this.$store.getters.organs.filter(i => i.shortName !== '攀枝花所' && i.shortName !== '泸州所')
    },
    currentOrganData() {
      return this.currentData[this.currentOrgan.id]
    },
    ageOption() {
      const v = this.currentOrganData
      return {
        title: {
          text: '年龄概况',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {},
        xAxis: {
          data: ['全体人员', '男民警', '女民警', '正科级', '副科级']
        },
        yAxis: {},
        series: [
          {
            name: '平均年龄',
            type: 'bar',
            data: [(v['total'] / (v['num'] || 1)).toFixed(2), (v['maleTotal'] / (v['maleNum'] || 1)).toFixed(2), (v['femaleTotal'] / (v['femaleNum'] || 1)).toFixed(2), (v['zkTotal'] / (v['zkNum'] || 1)).toFixed(2), (v['fkTotal'] / (v['fkNum'] || 1)).toFixed(2)]
          },
          {
            name: '最大年龄',
            type: 'bar',
            data: [v['oldest'], v['maleOldest'], v['femaleOldest'], v['zkOldest'], v['fkOldest']]
          },
          {
            name: '最小年龄',
            type: 'bar',
            data: [v['youngest'], v['maleYoungest'], v['femaleYoungest'], v['zkYoungest'], v['fkYoungest']]
          }
        ]
      }
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
        this.currentData = JSON.parse(this.originData)
        this.currentOrgan = this.organs[0]
        this.mountCharts()
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    mountCharts() {
      const charts = echarts.init(document.getElementById('ageChart'))
      charts.setOption(this.ageOption)
    },
    onChangeOrgan(v) {
      this.currentOrgan = v
      this.mountCharts()
    },
    getAgeString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData).length === 0) {
        return ''
      }
      const v = this.currentData[this.currentOrgan.id]
      return `${this.currentOrgan.shortName}平均年龄${(v['total'] / (v['num'] || 1)).toFixed(2)}岁，
            最大${v['oldest']}岁，最小${v['youngest']}岁。
            男民警平均年龄${(v['maleTotal'] / (v['maleNum'] || 1)).toFixed(2)}岁，
            最大${v['maleOldest']}岁，最小${v['maleYoungest']}岁。
            女民警平均年龄${(v['femaleTotal'] / (v['femaleNum'] || 1)).toFixed(2)}岁，
            最大${v['femaleOldest']}岁，最小${v['femaleYoungest']}岁。
            20-24岁${v['20-24']}人，25-29岁${v['25-29']}人，
            30-34岁${v['30-34']}人，35-39岁${v['35-39']}人，
            40-44岁${v['40-44']}人，45-49岁${v['45-49']}人，
            50-54岁${v['50-54']}人，55-59岁${v['55-59']}人，
            其中两年内退休人员${v['willRetire']}人。<br />
            正科级领导干部平均年龄${(v['zkTotal'] / (v['zkNum'] || 1)).toFixed(2)}岁，
            最大${v['zkOldest']}岁，最小${v['zkYoungest']}岁。
            副科级领导干部平均年龄${(v['fkTotal'] / (v['fkNum'] || 1)).toFixed(2)}岁，
            最大${v['fkOldest']}岁，最小${v['fkYoungest']}岁。
            科级领导干部中，30岁以下${v['zk-20-29'] + v['fk-20-29']}人，
            正科级${v['zk-20-29']}人，副科级${v['fk-20-29']}人。
            30-34岁${v['zk-30-34'] + v['fk-30-34']}人，
            正科级${v['zk-30-34']}人，副科级${v['fk-30-34']}人。
            35-39岁${v['zk-35-39'] + v['fk-35-39']}人，
            正科级${v['zk-35-39']}人，副科级${v['fk-35-39']}人。
            40-44岁${v['zk-40-44'] + v['fk-40-44']}人，
            正科级${v['zk-40-44']}人，副科级${v['fk-40-44']}人。
            45-49岁${v['zk-45-49'] + v['fk-45-49']}人，
            正科级${v['zk-45-49']}人，副科级${v['fk-45-49']}人。
            50-54岁${v['zk-50-54'] + v['fk-50-54']}人，
            正科级${v['zk-50-54']}人，副科级${v['fk-50-54']}人。
            55岁以上${v['zk-55-59'] + v['fk-55-59']}人，
            正科级${v['zk-55-59']}人，副科级${v['fk-55-59']}人。`
    }
  }

}
</script>

<style>

</style>
