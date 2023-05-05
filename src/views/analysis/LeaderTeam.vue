<!--
 * @Author: truxcoder
 * @Date: 2022-09-21 09:43:40
 * @LastEditTime: 2023-05-05 14:06:49
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
        <span class=" font-bold">班子成员</span>
      </div>
      <div class="w-full flex flex-wrap">
        <div v-for="leader in currentLeaders" :key="leader.id" class="block m-1">
          <el-image style="width: 130px; height: 150px" :src="getPhotoURL(leader.idCode)" fit="fit" />
          <div class="title text-center"><el-link :href="getDetailLink(leader.personnelId)" target="_blank">{{ leader.personnelName }}</el-link></div>
        </div>
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
        <span class=" font-bold">年龄结构</span>
      </div>
      <div class="w-full">
        <div v-html="getAgeString()" />
        <div class="w-full flex h-96 mt-4">
          <div id="age-overview" class="w-1/2">年龄概况</div>
          <div id="age-distribution" class="flex-1">年龄分布</div>
        </div>
      </div>
    </el-card>

    <div class=" mt-4 flex">
      <el-card class=" w-1/2">
        <div slot="header">
          <span class=" font-bold">学历结构</span>
        </div>
        <div class="w-full">
          <div v-html="getEduString()" />
          <div class="w-full flex h-80 mt-4">
            <div id="edu-all" class="w-full h-96">整体学历</div>
          </div>
        </div>
      </el-card>

      <el-card class=" flex-1 ml-4">
        <div slot="header">
          <span class=" font-bold">任职结构</span>
        </div>
        <div class="w-full">
          <div v-html="getPostString()" />
          <div id="post" class="w-full flex h-80 mt-4">任职结构</div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import { getPhoto } from '@/utils/personnel'
import { getDetailLink } from '@/utils/personnel'
import * as analysisMethods from './analysisMethods'

import * as echarts from 'echarts'
import { isEmpty } from 'lodash/lang'

export default {
  name: 'LeaderTeam',
  mixins: [common_mixin, permission_mixin],
  data() {
    return {
      resource: 'analysis',
      now: '',
      originData: '',
      currentData: {},
      currentOrgan: {},
      departments: [],
      leaders: []
    }
  },
  computed: {
    organs() {
      return this.$store.getters.organs.filter(i => i.shortName !== '局机关' && i.shortName !== '攀枝花所' && i.shortName !== '泸州所')
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
    currentPostData() {
      return this.currentData['post'][this.currentOrgan.id]
    },
    currentLeaders() {
      return this.leaders.filter(i => i.organId === this.currentOrgan.id)
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
      return analysisMethods.getLeaderAgeOverviewOption(v)
    },
    ageDisOption() {
      const v = this.currentAgeData
      return analysisMethods.getLeaderAgeDisOption(v)
    },
    eduOption() {
      const v = this.currentEduData
      const num = this.currentLeaders.length ?? 0
      return analysisMethods.getLeaderEduOption(v, num)
    },
    postOption() {
      const v = this.currentPostData
      return analysisMethods.getLeaderPostOption(v)
    }
  },
  created() {
    this.check().then(() => {
      this.now = Date.now()
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      request(this.resource, 'leader').then(response => {
        this.leaders = response.leaders
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
      echarts.init(document.getElementById('post'))
    },
    setOption() {
      const ageOverviewCharts = echarts.getInstanceByDom(document.getElementById('age-overview'))
      const ageDisCharts = echarts.getInstanceByDom(document.getElementById('age-distribution'))
      const eduCharts = echarts.getInstanceByDom(document.getElementById('edu-all'))
      const postCharts = echarts.getInstanceByDom(document.getElementById('post'))
      // const eduFkCharts = echarts.getInstanceByDom(document.getElementById('edu-fk'))
      ageOverviewCharts.setOption(this.ageOverviewOption)
      ageDisCharts.setOption(this.ageDisOption)
      eduCharts.setOption(this.eduOption)
      postCharts.setOption(this.postOption)
      // eduFkCharts.setOption(this.eduFkOption)
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
      const position = this.departmentMap[this.currentOrgan.id]
      return analysisMethods.getLeaderOverviewString(this.currentOrgan, v, position)
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
      return analysisMethods.getLeaderAgeString(this.currentOrgan, v)
    },
    getEduString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData['edu']).length === 0) {
        return ''
      }
      const v = this.currentEduData
      const num = this.currentLeaders.length ?? 1
      return analysisMethods.getLeaderEduString(this.currentOrgan, v, num)
    },
    getPostString() {
      if (Object.keys(this.currentOrgan).length === 0 || Object.keys(this.currentData['post']).length === 0) {
        return ''
      }
      const v = this.currentPostData
      return analysisMethods.getLeaderPostString(this.currentOrgan, v)
    },
    getPhotoURL(idCode) {
      return idCode ? getPhoto(idCode, 'small') + '?now=' + this.now : ''
    },
    getDetailLink(id) {
      return getDetailLink(id)
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
