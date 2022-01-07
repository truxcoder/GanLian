<template>
  <el-container>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="人员基本情况">
          <basic :loading="loading" :single-personnel-data="originData" @reFetchCpnData="reFetchCpnData" />
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
import 'tailwindcss/tailwind.css'
import { personnelDetail } from '@/api/personnel'
import { postDetail } from '@/api/post'
import { appraisalDetail } from '@/api/appraisal'
import { awardDetail } from '@/api/award'
import { punishDetail } from '@/api/punish'
import { disciplineDetail } from '@/api/discipline'
import AwardAndPunish from './PerDetail/AwardAndPunish.vue'
import Appraisal from './PerDetail/Appraisal.vue'
import Post from './PerDetail/Post.vue'
import Discipline from './PerDetail/Discipline.vue'
import Basic from './PerDetail/Basic.vue'

export default {
  name: 'Pdetail',
  components: { AwardAndPunish, Appraisal, Post, Basic, Discipline },
  data() {
    return {
      originData: {},
      posts: [],
      appraisals: [],
      awards: [],
      punishes: [],
      disciplines: [],
      loading: true
    }
  },
  created() {
    this.fetchAllData({ id: this.$route.query.id })
  },
  methods: {
    fetchAllData(params = {}) {
      this.loading = true
      const promises = [personnelDetail(params), postDetail(params), appraisalDetail(params), awardDetail(params), punishDetail(params), disciplineDetail(params)]
      Promise.all(promises).then(responses => {
        this.originData = responses[0].data
        this.posts = responses[1].data
        this.appraisals = responses[2].data.sort((a, b) => a.years - b.years)
        this.awards = responses[3].data
        this.punishes = responses[4].data
        this.disciplines = responses[5].data
        this.loading = false
      })
    },
    fetchPersonnelData() {
      personnelDetail({ id: this.$route.query.id }).then(response => {
        this.originData = response.data
      })
    },
    fetchPostData() {
      postDetail({ id: this.$route.query.id }).then(response => {
        this.posts = response.data
      })
    },
    fetchAppraisalData() {
      appraisalDetail({ id: this.$route.query.id }).then(response => {
        this.appraisals = response.data
      })
    },
    fetchAwardData() {
      awardDetail({ id: this.$route.query.id }).then(response => {
        this.awards = response.data
      })
    },
    fetchPunishData() {
      punishDetail({ id: this.$route.query.id }).then(response => {
        this.punishes = response.data
      })
    },
    fetchDisciplineData() {
      disciplineDetail({ id: this.$route.query.id }).then(response => {
        this.disciplines = response.data
      })
    },
    reFetchCpnData(cpn) {
      switch (cpn) {
        case 'Basic':
          this.fetchPersonnelData()
          break
        case 'Post':
          this.fetchPostData()
          break
        case 'Award':
          this.fetchAwardData()
          break
        case 'Punish':
          this.fetchPunishData()
          break
        case 'Appraisal':
          this.fetchAppraisalData()
          break
        case 'Discipline':
          this.fetchDisciplineData()
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
