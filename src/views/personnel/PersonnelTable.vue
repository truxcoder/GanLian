<!--
 * @Author: truxcoder
 * @Date: 2021-11-09 12:43:53
 * @LastEditTime: 2022-08-31 10:08:35
 * @LastEditors: truxcoder
 * @Description: 一览表
-->
<template>
  <el-container :loading="loading" class="outside">
    <div v-if="!canReadBasicInfo" class=" w-full h-full text-center text-2xl">
      <h1>无权查看此人一览表</h1>
    </div>
    <el-main v-if="canReadBasicInfo">
      <table class="info-table">
        <tr class="top-row">
          <td class="first-column"><div v-html="`姓&emsp;名`" /></td>
          <td class="second-column">{{ currentData.name }}</td>
          <td class="third-column"><div v-html="`性&emsp;别`" /></td>
          <td class="fouth-column">{{ currentData.gender }}</td>
          <td class="fifth-column">出生年月 <br />（岁）</td>
          <td class="sixth-column">{{ currentData.birthday }}<br />{{ currentData.age }}</td>
          <td id="photo-zone" rowspan="4"><div v-loading="photoLoading" class="photoZone ">
            <!-- <img :src="photoURL" alt class="photo" /> -->
            <el-image fit="fit" :src="photoURL" class="photo">
              <div slot="error" class="image-slot">
                <img src="photo.jpg" alt class="photo" />
              </div>
            </el-image>
          </div></td>
        </tr>
        <tr class="top-row">
          <td class="first-column"><div v-html="`民&emsp;族`" /></td>
          <td class="second-column">{{ currentData.nation }}</td>
          <td class="third-column"><div v-html="`籍&emsp;贯`" /></td>
          <td class="fouth-column">{{ currentData.hometown }}</td>
          <td class="fifth-column"><div v-html="`出&ensp;生&ensp;地`" /></td>
          <td class="sixth-column">{{ currentData.birthplace }}</td>
        </tr>
        <tr class="top-row">
          <td class="first-column"><div v-html="`警&emsp;号`" /></td>
          <td class="second-column">{{ currentData.policeCode }}</td>
          <td class="third-column"><div v-html="`政&emsp;治<br />面&emsp;貌`" /></td>
          <td class="fouth-column">{{ currentData.political }}</td>
          <td class="fifth-column">婚姻状况</td>
          <td class="sixth-column">{{ currentData.marriage }}</td>
        </tr>
        <tr class="top-row">
          <td class="first-column"><div v-html="`入&emsp;党<br />时&emsp;间`" /></td>
          <td class="second-column">{{ currentData.joinPartyDay }}</td>
          <td class="third-column">参加工<br />作时间</td>
          <td class="fouth-column">{{ currentData.startJobDay }}</td>
          <td class="fifth-column">健康状况</td>
          <td class="sixth-column">{{ currentData.health }}</td>
        </tr>
        <tr class="top-row">
          <td class="first-column">专业技<br />术职务</td>
          <td colspan="2">{{ currentData.technicalTitle }}</td>
          <td class="fouth-column">熟悉专业<br />有何专长</td>
          <td colspan="3">{{ currentData.specialty }}</td>
        </tr>
        <tr class="top-row">
          <td rowspan="2" class="first-column"><div v-html="`学&emsp;历<br />学&emsp;位`" /></td>
          <td class="second-column"><div v-html="`全日制<br />教&emsp;育`" /></td>
          <td colspan="2"><div v-html="currentData.fullTimeEdu" /></td>
          <td class="fouth-column">毕业院校<br />系及专业</td>
          <td colspan="2"><div v-html="currentData.fullTimeSchool" /></td>
        </tr>
        <tr class="top-row">
          <td class="second-column"><div v-html="`在&emsp;职<br />教&emsp;育`" /></td>
          <td colspan="2"><div v-html="currentData.partTimeEdu" /></td>
          <td class="fouth-column">毕业院校<br />系及专业</td>
          <td colspan="2"><div v-html="currentData.partTimeSchool" /></td>
        </tr>
        <tr class="top-row">
          <td colspan="2"><div v-html="`现&emsp;任&emsp;职&emsp;务`" /></td>
          <td colspan="5">{{ currentData.post }}</td>
        </tr>

      </table>
      <table class="main-table">
        <tr>
          <td class="left-column"><div class="left-div" v-html="`简&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;历`" /></td>
          <td colspan="5" class="right-column"><p v-for="(c,i) in currentData.resume" :key="i"><pre>{{ c.content }}</pre></p></td>
        </tr>
        <tr>
          <td class="left-column"><div class="left-div">奖惩情况</div></td>
          <td colspan="5" class="right-column"><div>{{ currentData.awardAndPunish }}</div></td>
        </tr>
        <tr>
          <td class="left-column"><div class="left-div"><p>年度考</p><p>核情况</p></div></td>
          <td colspan="5" class="right-column"><div>{{ currentData.appraisal }}</div></td>
        </tr>
        <tr>
          <td class="left-column" :rowspan="currentData.family ? currentData.family.length + 1 : 1"><div class="left-div">家庭主要成员及重要社会关系</div></td>
          <td class=" w-14">称 谓</td>
          <td class=" w-16" v-html="`姓&emsp;名`" />
          <td class="w-8">年龄</td>
          <td class="w-20" v-html="`政&ensp;治<br />面&ensp;貌`" />
          <td v-html="`工&ensp;作&ensp;单&ensp;位&ensp;及&ensp;职&ensp;务`">工作单位及职务</td>
        </tr>
        <tr v-for="(f, i) in currentData.family" :key="i" class="family-tr">
          <td>{{ f.relation }}</td>
          <td>{{ f.name }}</td>
          <td>{{ f.age }}</td>
          <td>{{ f.political }}</td>
          <td>{{ f.organ + f.post }}</td>
        </tr>
      </table>
    </el-main>
  </el-container>
</template>

<script>

import { request } from '@/api/index'
import { permission_mixin } from '@/common/mixin/permission'
import dayjs from 'dayjs'
import { getAge } from '@/utils'
import { formatResume } from '@/utils/resume'
import { awardGrade } from '@/utils/dict'
import { getPhoto } from '@/utils/personnel'
import { isNormalRole } from '@/utils/permission'

export default {
  name: 'PersonnelTable',
  mixins: [permission_mixin],
  data() {
    return {
      originData: {},
      currentData: {},
      response: {},
      loading: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    organList() {
      return this.$store.getters.organs
    },
    awardMap() {
      const _map = new Map()
      awardGrade.forEach(item => {
        _map.set(item.value, item.label)
      })
      return _map
    },
    photoURL() {
      return this.currentData?.idCode ? getPhoto(this.currentData?.idCode, 'small') + '?now=' + this.now : ''
    },
    // 是否为普通用户
    isNormal() {
      return isNormalRole(this.$store.getters.roles)
    },
    // 是否能读取个人基本信息
    canReadBasicInfo() {
      if (this.isNormal) {
        return true
      }
      if (this.id === this.$store.getters.personnelId) {
        return true
      }
      return this.can.read
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }

    this.check('DetailBasic')
      .then(() => {
        // 如果为浏览者为本人或者具备全局权限，则放开权限
        if (this.id === this.$store.getters.personnelId || this.can.global) {
          this.fetchData()
          return
        } else {
          // 否则，看浏览者是否与该人员同一单位，如果是同一单位，说明具备所级权限，则放开
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
      const data = { personnelId: this.id }
      request('appointment', 'table', data).then(response => {
        this.originData = response.data ?? {}
        this.response = response
        this.cleanData()
        this.loading = false
      })
    },
    getResumeList(r) {
      const resume = r ?? ''
      let result = []
      if (resume === '') {
        return []
      }
      result = JSON.parse(resume)
      return result
    },
    getAwardName(award) {
      if (award.category === 1) {
        if (award.grade === 1) {
          return award.content
        }
        return '个人' + this.awardMap.get(award.grade)
      }
      if (award.category === 2) {
        return award.content
      }
      return ''
    },
    // 格式化相关数据，这里的格式化逻辑与生成干审表模块保持一致，如改动的话两边都要改
    cleanData() {
      this.currentData = { ...this.originData }
      this.currentData.age = ' (' + getAge(dayjs(this.currentData.birthday).format('YYYY-MM-DD')) + '岁)'
      this.currentData.birthday = dayjs(this.currentData.birthday).format('YYYY.MM')
      this.currentData.joinPartyDay = dayjs(this.currentData.joinPartyDay).year() === 1 ? '' : dayjs(this.currentData.joinPartyDay).format('YYYY.MM')
      this.currentData.startJobDay = dayjs(this.currentData.startJobDay).format('YYYY.MM')
      this.currentData.fullTimeEdu = this.currentData.fullTimeDegree ? this.currentData.fullTimeEdu + '<br />' + this.currentData.fullTimeDegree : this.currentData.fullTimeEdu
      this.currentData.partTimeEdu = this.currentData.partTimeDegree ? this.currentData.partTimeEdu + '<br />' + this.currentData.partTimeDegree : this.currentData.partTimeEdu
      this.currentData.fullTimeSchool = this.currentData.fullTimeSchool ? this.currentData.fullTimeSchool + (this.currentData.fullTimeMajor ? '<br />' + this.currentData.fullTimeMajor : '') : ''
      this.currentData.partTimeSchool = this.currentData.partTimeSchool ? this.currentData.partTimeSchool + (this.currentData.partTimeMajor ? '<br />' + this.currentData.partTimeMajor : '') : ''
      if (this.currentData.fullTimeEdu === '小学' || this.currentData.fullTimeEdu === '初中' || this.currentData.fullTimeEdu === '高中') {
        this.currentData.fullTimeSchool = ''
      }
      // 找到现任职务
      let post = ''
      this.response.posts.reduce((pre, cur, index, array) => {
        post = pre
        if (post !== '') {
          post += '、'
        }
        if (index !== 0 && array[index - 1].organ === cur.organ && array[index - 1].department === cur.department) {
          post += cur.positionName
        } else if (index !== 0 && array[index - 1].organ === cur.organ) {
          const department = cur.department.includes('领导') || cur.department.includes('高级警长') || cur.department.includes('调研员') ? '' : cur.department
          post = post + department + cur.positionName
        } else {
          const department = cur.department.includes('领导') || cur.department.includes('高级警长') || cur.department.includes('调研员') || cur.department === cur.organ ? '' : cur.department
          post = post + cur.organ + department + cur.positionName
        }
        return post
      }, post)
      this.currentData.post = post
      const resume = []
      const resumeList = this.getResumeList(this.currentData.resume)
      for (const i in resumeList) {
        if ('cum' in resumeList[i]) {
          continue
        }
        resume.push({ content: formatResume(i, resumeList[i], resumeList, 'YYYY.MM') })
      }
      this.currentData.resume = resume
      const award = this.response.awards.map(i => {
        if (i.category === 1 && i.grade !== 1) {
          return dayjs(i.getTime).format('YYYY年MM月') + '记' + this.getAwardName(i) + '一次'
        }
        return dayjs(i.getTime).format('YYYY年MM月') + ' ' + this.getAwardName(i)
      }).join(';')
      const disciplines = this.response.disciplines.map(i => dayjs(i.getTime).format('YYYY年MM月') + '经' + i.organ + '批准' + '受到' + i.dictName + '处分').join(';')
      let awardAndPunish = '无'
      if (award !== '' && disciplines === '') {
        awardAndPunish = award
      }
      if (award === '' && disciplines !== '') {
        awardAndPunish = disciplines
      }
      if (award !== '' && disciplines !== '') {
        awardAndPunish = award + '\n' + disciplines
      }
      this.currentData.awardAndPunish = awardAndPunish
      let appraisal = ''
      this.response.appraisals.forEach(i => {
        if (appraisal !== '') {
          appraisal += ';'
        }
        appraisal += i.years + '年年度考核为' + i.conclusion
      })
      appraisal += '。'
      this.currentData.appraisal = appraisal

      const family = this.response.family.map(i => {
        // 按照干审表规定，如家属已去世，则对应年龄留空
        if (i.organ.includes('已去世') || i.organ.includes('已故') || i.post.includes('已去世') || i.post.includes('已故')) {
          i.age = ''
        } else {
          i.age = getAge(dayjs(i.birthday).format('YYYY-MM-DD'))
        }
        return i
      })
      const familyItem = { relation: '', name: '', age: '', organ: '', post: '', political: '' }
      const length = family.length
      if (length < 7) {
        for (let i = 0; i < 7 - length; i++) {
          family.push(familyItem)
        }
      }
      this.currentData.family = family
    }
  }
}
</script>

<style scoped>
.outside{
  background: #efefef;
}
.info-table, .main-table {
  width: 100%;
  text-align: center;
  border-collapse: separate;
  border-spacing: 0;
  border-top: 1px solid #999;
  border-left: 1px solid #999;
  line-height: 20px;
  background: #fff;
  font-family: "宋体", "宋体GB2312", "新宋体", "微软雅黑", "Times New Roman";
}
.main-table {
  border-top: none;
}
.info-table td,.main-table td {
  border: 1px solid #999;
  border-top: none;
  border-left: none;
}
.top-row {
  min-height: 45px;
  height: 45px;
}
.first-column {
  width: 4rem;
}
.second-column {
  width: 5rem;
}
.third-column {
  width: 4rem;
}
.fouth-column {
  width: 5rem;
}
.fifth-column {
  width: 5rem;
}
#photo-zone {
  width: 160px;
}
.left-column {
  width: 3rem;
}
.left-div {
  /* width: 100%;
  min-height: 100px;
  height: 100%; */
  /* display: flex;
  flex-direction: column;
  justify-content: space-around; */
  width: 100%;
  writing-mode: vertical-lr;
  display: flex;
  -webkit-display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: 0.2rem;
  padding: 10px 0;

}
.left-div div {
  height: 1rem;
  line-height: 1rem;
}
.right-column {
  text-align: left;
  padding: 10px;
  word-break: break-word;
  word-break: normal;
}
.right-column pre {
  word-break: normal!important;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  text-indent: -9rem;
  margin-left: 9rem;
  font-family: "宋体", "宋体GB2312", "新宋体", "微软雅黑", "Times New Roman";
}
.family-tr td {
  min-height: 40px;
  height: 40px;
}
.photo {
  width: 150px;
  margin: auto;
}
</style>
