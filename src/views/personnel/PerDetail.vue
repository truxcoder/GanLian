<template>
  <el-container>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="人员基本情况">
          <basic :loading="loading" :single-personnel-data="originData" @reFetchCpnData="reFetchCpnData" />
        </el-tab-pane>
        <el-tab-pane label="培训情况">
          <training :loading="loading" :passed-data="trainings" :personnel-id="originData.id" @reFetchCpnData="reFetchCpnData" />
        </el-tab-pane>
        <el-tab-pane label="任职情况">
          <post :loading="loading" :passed-data="posts" :single-personnel-data="originData" @reFetchCpnData="reFetchCpnData" />
        </el-tab-pane>
        <el-tab-pane label="奖惩情况">
          <award-and-punish :loading="loading" :award-passed-data="awards" :punish-passed-data="punishes" :single-personnel-data="originData" @reFetchCpnData="reFetchCpnData" />
        </el-tab-pane>
        <el-tab-pane label="考核情况">
          <appraisal :loading="loading" :passed-data="appraisals" :single-personnel-data="originData" @reFetchCpnData="reFetchCpnData" />
        </el-tab-pane>
        <el-tab-pane label="处分情况">
          <discipline :loading="loading" :passed-data="disciplines" :single-personnel-data="originData" @reFetchCpnData="reFetchCpnData" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
// import 'tailwindcss/tailwind.css'
import { request } from '@/api/index'
import AwardAndPunish from './PerDetail/AwardAndPunish.vue'
import Appraisal from './PerDetail/Appraisal.vue'
import Post from './PerDetail/Post.vue'
import Discipline from './PerDetail/Discipline.vue'
import Basic from './PerDetail/Basic.vue'
import Training from './PerDetail/Training.vue'

import { detail_permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'Pdetail',
  components: { AwardAndPunish, Appraisal, Post, Basic, Discipline, Training },
  mixins: [detail_permission_mixin],
  data() {
    return {
      originData: {},
      posts: [],
      trains: [],
      appraisals: [],
      awards: [],
      punishes: [],
      disciplines: [],
      trainings: [],
      queryData: {},
      loading: true
    }
  },
  created() {
    this.check().then(() => {
      this.queryData = { id: this.$route.query.id }
      this.fetchAllData(this.queryData)
    })
  },
  methods: {
    fetchAllData(data = {}) {
      this.loading = true
      const promises = [
        request('personnel', 'detail', data),
        request('post', 'detail', data),
        request('appraisal', 'detail', data),
        request('award', 'detail', data),
        request('punish', 'detail', data),
        request('discipline', 'detail', data),
        request('training', 'detail', data)
      ]
      Promise.all(promises).then(responses => {
        this.originData = responses[0].data
        this.trains = responses[0].trains
        this.posts = responses[1].data
        // this.appraisals = responses[2].data.sort((a, b) => a.years - b.years)
        this.appraisals = responses[2].data
        this.awards = responses[3].data
        this.punishes = responses[4].data
        this.disciplines = responses[5].data
        this.trainings = responses[6].data
        this.loading = false
      })
    },
    /**
     * @description: 获取组件数据值
     * @param {*} obj 组件对象的resource值
     * @param {*} key 本地data里对应组件的数据对象
     * @return {*}
     */
    fetchData(obj, key) {
      request(obj, 'detail', this.queryData).then(response => {
        this[key] = response.data
      })
    },
    reFetchCpnData(cpn) {
      switch (cpn) {
        case 'Basic':
          this.fetchData('personnel', 'originData')
          break
        case 'Post':
          this.fetchData('post', 'posts')
          break
        case 'Award':
          this.fetchData('award', 'awards')
          break
        case 'Punish':
          this.fetchData('punish', 'punishes')
          break
        case 'Appraisal':
          this.fetchData('appraisal', 'appraisals')
          break
        case 'Discipline':
          this.fetchData('discipline', 'disciplines')
          break
        case 'Training':
          this.fetchData('training', 'trainings')
          break
        default:
          console.log('cpn:', cpn)
          break
      }
    }
  }
}
</script>

<style></style>
