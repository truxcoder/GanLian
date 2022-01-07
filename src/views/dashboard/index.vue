<!--
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2021-12-24 14:36:00
 * @LastEditors: truxcoder
 * @Description:
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
        <trux-list v-slot="scope" title="各单位干部统计情况" :data="listData2">
          <li class="el-icon-document" />
          {{ scope.rowData }}
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
import { mapGetters } from 'vuex'
import TruxList from '@/components/trux/list.vue'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  components: { TruxList },
  data() {
    return {
      originData: [],
      currentData: [],
      count: 0,
      listTitle: '全系统干部统计情况',
      listData: [
        { label: '干部总数', value: 3051 },
        { label: '党员总数', value: 895 },
        { label: '男民警', value: 2025 },
        { label: '女民警', value: 1026 },
        { label: '基层民警', value: 2100 },
        { label: '机关民警', value: 951 },
        { label: '50岁以上民警', value: 765 },
        { label: '30岁以下民警', value: 212 }
      ],
      listData2: [
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人',
        '资阳所:  民警286人,其中男民警200人，女民警86人，党员125人，35岁以下青年民警81人'
      ],
      option: {
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
            data: [
              {
                value: 335,
                name: '资阳所'
              },
              {
                value: 198,
                name: '女所'
              },
              {
                value: 522,
                name: '新华所'
              },
              {
                value: 445,
                name: '眉山所'
              },
              {
                value: 95,
                name: '内江所'
              },
              {
                value: 112,
                name: '成都所'
              },
              {
                value: 68,
                name: '雅安所'
              }
            ]
          }
        ]
      },
      ageOption: {
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
            data: [
              {
                value: 880,
                name: '50岁以上'
              },
              {
                value: 568,
                name: '40-50岁'
              },
              {
                value: 1042,
                name: '30-40岁'
              },
              {
                value: 565,
                name: '30岁以下'
              }
            ]
          }
        ]
      },
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
    ...mapGetters(['name'])
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
  },
  mounted() {
    let charts = echarts.init(document.getElementById('police'))
    charts.setOption(this.option)
    charts = echarts.init(document.getElementById('age'))
    charts.setOption(this.ageOption)
    charts = echarts.init(document.getElementById('fenbu'))
    charts.setOption(this.fenbuOption)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#dashboard-container {
  color: #606266;
  font-size: 14px;
}
</style>
