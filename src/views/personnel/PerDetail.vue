<!--
 * @Author: truxcoder
 * @Date: 2021-11-09 12:43:53
 * @LastEditTime: 2022-05-30 14:57:55
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <el-container>
    <el-main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="basic" label="人员基本情况">
          <basic :loading="loading" :base-data="baseData" @updateSuccess="updateSuccess" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailFamily" name="family" label="家庭及社会关系">
          <family :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailTraining" name="training" label="培训情况">
          <training />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailPost" name="post" label="任职情况">
          <post :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailAwardPunish" name="award-and-punish" label="奖惩情况">
          <award-and-punish :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailAppraisal" name="appraisal" label="考核情况">
          <appraisal :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailDiscipline" name="discipline" label="处分情况">
          <discipline :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailReport" name="report" label="信访举报">
          <report :base-data="baseData" />
        </el-tab-pane>
        <el-tab-pane v-if="menu.DetailAffair" name="affair" label="监督事项">
          <affair :base-data="baseData" />
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
import Affair from './PerDetail/Affair.vue'
import Family from './PerDetail/Family.vue'

import { detailObj } from '@/utils/detail'

import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'
import { isNormalRole } from '@/utils/permission'

export default {
  name: 'Pdetail',
  components: { AwardAndPunish, Appraisal, Post, Basic, Discipline, Training, Report, Affair, Family },
  mixins: [permission_mixin],
  data() {
    return {
      baseData: {},
      loading: false,
      activeName: 'basic',
      menu: {}
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }

    this.actCheck()
      .then(() => this.check('DetailBasic'))
      .then(() => {
        if (this.id === this.$store.getters.personnelId || this.can.global) {
          this.fetchData()
          return
        } else {
          request('personnel', 'organ', { id: this.id }).then(res => {
            if (!res.data || res.data !== this.$store.getters.organ) {
              this.$message.error('你无权查看此人信息!')
              this.$router.push('/401')
              return
            }
            this.fetchData()
          })
        }
      })
      .catch(err => {
        this.$message.error(err)
      })
  },
  methods: {
    fetchData() {
      this.loading = true
      this.queryData = { id: this.id }
      request('personnel', 'detail', this.queryData).then(response => {
        this.baseData = response.data ?? []
        this.loading = false
      })
    },
    updateSuccess() {
      this.fetchData()
    },
    actCheck(act = 'MENU', obj = null) {
      return new Promise((resolve, reject) => {
        // const sub = this.$store.getters.id
        const sub = isNormalRole(this.$store.getters.roles) ? 'normal' : this.$store.getters.id

        obj = obj ?? detailObj.map(i => i.name)
        request('permission', 'act_check', { sub, obj, act })
          .then(res => {
            this.menu = res.data
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style></style>
