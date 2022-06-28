<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名" prop="personnelId">
        <PersonnelOption ref="personnelOption" v-model="searchForm.personnelId" size="small" :form-item-width="searchItemWidth" />
      </el-form-item>
      <el-form-item v-if="can.global" label="单位" prop="organParam">
        <el-select v-model="searchForm.organParam" size="small" :style="searchItemWidth" multiple placeholder="请选择单位">
          <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button v-if="can.add" type="success" icon="el-icon-circle-plus-outline" size="mini" @click="handleEdit('add')">添加</el-button>
      <el-button v-if="total && can.delete" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
      <el-button v-if="can.read" type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
    </div>
    <div class="tableZone">
      <el-table
        v-loading="listLoading"
        :data="currentData"
        element-loading-text="Loading"
        stripe
        border
        :fit="true"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="单位" prop="organShortName" width="100" />
        <el-table-column align="center" label="人员">
          <template slot-scope="scope">
            <el-link :href="getDetailLink(scope.row.personnelId)" target="_blank">{{ scope.row.personnelName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="拟任职务" show-overflow-tooltip prop="appointPost" />
        <el-table-column align="center" label="拟免职务" show-overflow-tooltip prop="removePost" />
        <el-table-column align="center" label="任免理由" show-overflow-tooltip prop="reason" />
        <el-table-column align="center" label="审批机关意见" show-overflow-tooltip prop="opinion" />
        <el-table-column align="center" label="操作" width="260">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleEdit('update', scope.row)">编辑</el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
            <el-button v-if="can.manage" size="mini" type="primary" @click="handleExport(scope.$index, scope.row)">导出干审表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-if="total"
      class="pagination"
      background
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <AppointmentEdit :visible="editVisible" :action="action" :row="rowData" :options="options" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { delete_mixin } from '@/common/mixin/delete'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'

import AppointmentEdit from './AppointmentEdit.vue'
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'
import { getAge } from '@/utils'
import { formatResume } from '@/utils/resume'
import { awardGrade } from '@/utils/dict'

export default {
  name: 'Appointment',
  components: { AppointmentEdit, PersonnelOption },
  mixins: [common_mixin, delete_mixin, list_mixin, permission_mixin, search_mixin],
  data() {
    return {
      resource: 'appointment',
      queryMeans: 'backend',
      batchVisible: false,
      originData: [],
      currentData: [],
      organMap: {},
      searchForm: { personnelId: '' },
      searchItemWidth: { width: '160px' }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    },
    options() {
      return {
        organ: this.$store.getters.organs
      }
    },
    awardMap() {
      const _map = new Map()
      awardGrade.forEach(item => {
        _map.set(item.value, item.label)
      })
      return _map
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans, params)
      request('appointment', 'list', data, params).then(response => {
        if (response.count) {
          this.originData = response.data
          this.currentData = [...this.originData]
          this.count = response.count
        } else {
          this.originData = []
          this.currentData = []
          this.count = 0
        }
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    loadFile(url, callback) {
      PizZipUtils.getBinaryContent(url, callback)
    },
    replaceErrors(key, value) {
      if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function(
          error,
          key
        ) {
          error[key] = value[key]
          return error
        },
        {})
      }
      return value
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
    handleExport(index, row) {
      const data = { personnelId: row.personnelId }
      request('appointment', 'table', data).then(response => {
        if (response.data) {
          this.loadFile('renmianbiao.docx', (
            error,
            content
          ) => {
            if (error) {
              throw error
            }
            const zip = new PizZip(content)
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
            const fullTimeEdu = response.data.fullTimeDegree ? response.data.fullTimeEdu + '\n' + response.data.fullTimeDegree : response.data.fullTimeEdu
            const partTimeEdu = response.data.partTimeDegree ? response.data.partTimeEdu + '\n' + response.data.partTimeDegree : response.data.partTimeEdu
            const fullTimeSchool = response.data.fullTimeSchool ? response.data.fullTimeSchool + '\n' + response.data.fullTimeMajor + '专业' : ''
            const partTimeSchool = response.data.partTimeSchool ? response.data.partTimeSchool + '\n' + response.data.partTimeMajor + '专业' : ''
            let post = ''
            response.posts.reduce((pre, cur, index, array) => {
              post = pre
              if (post !== '') {
                post += '、'
              }
              if (index !== 0 && array[index - 1].organ === cur.organ && array[index - 1].department === cur.department) {
                post += cur.positionName
              } else if (index !== 0 && array[index - 1].organ === cur.organ) {
                post = post + cur.department + cur.positionName
              } else {
                post = post + cur.organ + cur.department + cur.positionName
              }
              return post
            }, post)

            const family = response.family.map(i => {
              i.age = getAge(dayjs(i.birthday).format('YYYY-MM-DD'))
              return i
            })
            const familyItem = { relation: '', name: '', age: '', organ: '', post: '', political: '' }
            const length = family.length
            if (length < 7) {
              for (let i = 0; i < 7 - length; i++) {
                family.push(familyItem)
              }
            }
            const resume = []
            const resumeList = this.getResumeList(response.data.resume)
            for (const i in resumeList) {
              if ('cum' in resumeList[i]) {
                continue
              }
              resume.push({ content: formatResume(i, resumeList[i], resumeList, 'YYYY.MM') })
            }
            const award = response.awards.map(i => {
              const content = dayjs(i.getTime).format('YYYY.MM') + '  ' + this.getAwardName(i)
              return { content }
            })
            let appraisal = ''
            response.appraisals.forEach(i => {
              if (appraisal !== '') {
                appraisal += ';'
              }
              appraisal += i.years + '年年度考核结果为' + i.conclusion
            })
            appraisal += '。'
            doc.setData({
              name: response.data.name,
              gender: response.data.gender,
              birthday: dayjs(response.data.birthday).format('YYYY.MM'),
              age: getAge(dayjs(response.data.birthday).format('YYYY-MM-DD')),
              nation: response.data.nation,
              hometown: response.data.hometown,
              birthplace: response.data.birthplace,
              joinPartyDay: dayjs(response.data.joinPartyDay).format('YYYY.MM'),
              startJobDay: dayjs(response.data.startJobDay).format('YYYY.MM'),
              health: response.data.health,
              technicalTitle: response.data.technicalTitle,
              specialty: response.data.specialty,
              fullTimeEdu,
              fullTimeSchool,
              partTimeEdu,
              partTimeSchool,
              post,
              appointPost: row.appointPost,
              removePost: row.removePost,
              reason: row.reason,
              opinion: row.opinion,
              family: family,
              resume,
              award,
              appraisal
            })
            try {
              doc.render()
            } catch (error) {
              // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).

              console.log(JSON.stringify({ error: error }, this.replaceErrors))

              if (error.properties && error.properties.errors instanceof Array) {
                const errorMessages = error.properties.errors
                  .map(function(error) {
                    return error.properties.explanation
                  })
                  .join('\n')
                console.log('errorMessages', errorMessages)
                // errorMessages is a humanly readable message looking like this :
                // 'The tag beginning with "foobar" is unopened'
              }
              throw error
            }
            const out = doc.getZip().generate({
              type: 'blob',
              mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            })
            // Output the document using Data-URI
            saveAs(out, response.data.name + '干审表.docx')
          })
        } else {
          console.log('--')
        }
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.tool-bar {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
</style>
