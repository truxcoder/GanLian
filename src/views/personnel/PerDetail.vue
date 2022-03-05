<!--
 * @Author: truxcoder
 * @Date: 2021-11-09 12:43:53
 * @LastEditTime: 2022-03-04 14:51:21
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <el-container>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="人员基本情况">
          <basic :loading="loading" :base-data="baseData" @updateSuccess="updateSuccess" />
        </el-tab-pane>
        <el-tab-pane label="培训情况">
          <training />
        </el-tab-pane>
        <el-tab-pane label="任职情况">
          <post :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane label="奖惩情况">
          <award-and-punish :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane label="考核情况">
          <appraisal :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane label="处分情况">
          <discipline :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane label="信访举报">
          <report :base-data="baseData" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import AwardAndPunish from './PerDetail/AwardAndPunish.vue'
import Appraisal from './PerDetail/Appraisal.vue'
import Post from './PerDetail/Post.vue'
import Discipline from './PerDetail/Discipline.vue'
import Basic from './PerDetail/Basic.vue'
import Training from './PerDetail/Training.vue'
import Report from './PerDetail/Report.vue'

import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'Pdetail',
  components: { AwardAndPunish, Appraisal, Post, Basic, Discipline, Training, Report },
  mixins: [permission_mixin],
  data() {
    return {
      baseData: {},
      loading: false
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    // if (Object.keys(this.$store.getters.perDptMap).length === 0) {
    //   console.log('----changePerDptMap----')
    //   this.$store.dispatch('personnel/changePerDptMap')
    // }
    this.check('DetailBasic').then(() => {
      if (this.$route.query.id === this.$store.getters.id || this.can.global) {
        this.fetchData()
        return
      } else {
        request('user', 'organ', { id: this.$route.query.id }).then(res => {
          if (!res.data || res.data !== this.$store.getters.organ) {
            this.$message.error('你无权查看此人信息!')
            this.$router.push('/401')
            return
          }
          this.fetchData()
        })
      }
    })
  },
  methods: {
    fetchData() {
      this.loading = true
      this.queryData = { id: this.$route.query.id }
      request('personnel', 'detail', this.queryData).then(response => {
        this.baseData = response.data ?? []
        this.loading = false
      })
    },
    updateSuccess() {
      this.fetchData()
    }
  }
}
</script>

<style></style>
