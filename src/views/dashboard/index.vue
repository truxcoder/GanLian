<!--
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-07-27 16:35:00
 * @LastEditors: truxcoder
 * @Description: 控制台
-->
<template>
  <div id="dashboard-container" class="container mx-auto px-5 py-5">
    <div class=" flex">
      <div class=" w-1/4">
        <trux-list v-slot="scope" :title="listTitle" :data="listData">
          <li class="el-icon-document" />
          {{ scope.rowData.label }}:{{ scope.rowData.value }}
        </trux-list>
      </div>
      <div class=" flex-1 ml-4">
        <trux-list v-slot="scope" title="各单位干部统计情况" :data="Object.values(organData)">
          <li class="el-icon-document" />
          {{ scope.rowData | eachOrganFilter }}
        </trux-list>
      </div>
    </div>
    <div class=" flex mt-8">
      <div class=" w-1/2">
        <div id="police" class=" h-96 w-full">aaa</div>
      </div>
      <div class=" flex-1 ml-4">
        <div id="age" class=" h-96 w-full" />
      </div>
    </div>
    <div class=" flex mt-8">
      <div class=" w-full">
        <div id="fenbu" class=" h-96 w-full">aaa</div>
      </div>
    </div>
    <!-- ... -->
  </div>
</template>

<script>
import { request } from '@/api/index'
import TruxList from '@/components/trux/list.vue'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  components: { TruxList },
  filters: {
    eachOrganFilter(row) {
      return `${row.shortName}: 民警${row.total ?? 0}人,其中男民警${row.male ?? 0}人，女民警${(row.total ?? 0) - (row.male ?? 0)}人，党员${row.partyMember ??
        0}人，35岁以下青年民警${row.youngerThanThirtyFive ?? 0}人`
    }
  },
  data() {
    return {
      originData: [],
      currentData: [],
      count: 0,
      listTitle: '全系统干部统计情况',
      globalList: {},
      ageList: [],
      politicalList: [],
      genderList: [],
      totalList: [],
      fenbuOption: {
        title: {
          text: '民警分布',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {},
        xAxis: {
          data: ['资阳所', '女所', '新华所', '眉山所', '内江所', '成都所', '成都二所']
        },
        yAxis: {},
        series: [
          {
            name: '机关民警',
            type: 'bar',
            data: [92, 80, 150, 132, 27, 36, 25]
          },
          {
            name: '基层民警',
            type: 'bar',
            data: [210, 100, 362, 320, 80, 65, 68]
          }
        ]
      }
    }
  },
  computed: {
    organData() {
      const temp = {}
      const organs = this.$store.getters.organs ?? []
      if (organs.length > 0) {
        organs.forEach(item => {
          // console.log('item', item)
          if (item.id) {
            temp[item.id] = { name: item.name, shortName: item.shortName }
          }

          // temp[item.id].name = item.name
          // temp[item.id].shortName = item.shortName
        })
        this.totalList.forEach(item => {
          if (!(item.organId in temp)) {
            console.log(`${item.organId} not exist!`)
          } else {
            temp[item.organId].total = item.total ?? 0
          }
        })
        this.genderList.forEach(item => {
          if (!(item.organId in temp)) {
            console.log(`${item.organId} not exist!`)
          } else {
            temp[item.organId].male = item.total ?? 0
          }
        })
        // console.log('after gender foreach')
        this.politicalList.forEach(item => {
          if (!(item.organId in temp)) {
            console.log(`${item.organId} not exist!`)
          } else {
            temp[item.organId].partyMember = item.total ?? 0
          }
        })
        this.ageList.forEach(item => {
          if (!(item.organId in temp)) {
            console.log(`${item.organId} not exist!`)
          } else {
            temp[item.organId].olderThanFifty = item.olderThanFifty ?? 0
            temp[item.organId].betweenFortyFifty = item.betweenFortyFifty ?? 0
            temp[item.organId].betweenThirtyForty = item.betweenThirtyForty ?? 0
            temp[item.organId].youngerThanThirty = item.youngerThanThirty ?? 0
            temp[item.organId].youngerThanThirtyFive = item.youngerThanThirtyFive ?? 0
          }
        })
      }
      return temp
    },
    listData() {
      return [
        { label: '干部总数', value: this.globalList.total },
        { label: '党员总数', value: this.globalList.partyMember },
        { label: '男民警', value: this.globalList.male },
        { label: '女民警', value: this.globalList.total - this.globalList.male },
        { label: '基层民警', value: 2100 },
        { label: '机关民警', value: 951 },
        { label: '50岁以上民警', value: this.globalList.olderThanFifty },
        { label: '30岁以下民警', value: this.globalList.youngerThanThirty }
      ]
    },
    countOption() {
      const _data = Object.values(this.organData)
        .filter(item => item.total > 50)
        .map(item => {
          return { value: item.total, name: item.shortName }
        })
      let other = 0
      Object.values(this.organData).forEach(item => {
        if (item.total <= 50) {
          other += item.total
        }
      })
      _data.push({ value: other, name: '其他' })
      return {
        title: {
          text: '民警人数',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            label: {
              formatter: '{b}:{c}'
            },
            data: _data
          }
        ]
      }
    },
    ageOption() {
      return {
        title: {
          text: '年龄结构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            label: {
              formatter: '{b}:{c}'
            },
            data: [
              {
                value: this.globalList.olderThanFifty,
                name: '50岁以上'
              },
              {
                value: this.globalList.betweenFortyFifty,
                name: '40-50岁'
              },
              {
                value: this.globalList.betweenThirtyForty,
                name: '30-40岁'
              },
              {
                value: this.globalList.youngerThanThirty,
                name: '30岁以下'
              }
            ]
          }
        ]
      }
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    // request('discipline', 'list').then(res => console.log('request res:', res))
    request('dashboard').then(res => {
      this.ageList = res.ageList ?? []
      this.genderList = res.genderList ?? []
      this.politicalList = res.politicalList ?? []
      this.totalList = res.totalList ?? []
      this.globalList = res.globalList ?? {}
      this.mountCharts()
    })
  },
  mounted() {
    // let charts = echarts.init(document.getElementById('police'))
    // charts.setOption(this.countOption)
    // charts = echarts.init(document.getElementById('age'))
    // charts.setOption(this.ageOption)
    // charts = echarts.init(document.getElementById('fenbu'))
    // charts.setOption(this.fenbuOption)
  },
  methods: {
    mountCharts() {
      let charts = echarts.init(document.getElementById('police'))
      charts.setOption(this.countOption)
      charts = echarts.init(document.getElementById('age'))
      charts.setOption(this.ageOption)
      charts = echarts.init(document.getElementById('fenbu'))
      charts.setOption(this.fenbuOption)
    }
  }
}
</script>

<style lang="scss" scoped>
#dashboard-container {
  color: #606266;
  font-size: 14px;
}
</style>
