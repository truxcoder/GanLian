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
      <el-button type="primary" icon="el-icon-s-data" size="mini" @click="handleAllData">所有数据</el-button>
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
// const ImageModule = require('docxtemplater-image-module')
const ImageModule = require('docxtemplater-image-module-free')
const https = require('https')
const http = require('http')
const Stream = require('stream').Transform
// import { doc } from 'module'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'
import { getAge } from '@/utils'
import { formatResume } from '@/utils/resume'
import { awardGrade } from '@/utils/dict'
import { getPhoto } from '@/utils/personnel'

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
    getHttpData(url, callback) {
      const method = url.substr(0, 5) === 'https' ? https : http
      method
        .request(url, function(response) {
          if (response.statusCode !== 200) {
            return callback(
              new Error(
                `Request to ${url} failed, status code: ${response.statusCode}`
              )
            )
          }
          const data = new Stream()
          response.on('data', function(chunk) {
            data.push(chunk)
          })
          response.on('end', function() {
            callback(null, data.read())
          })
          response.on('error', function(e) {
            callback(e)
          })
        })
        .on('error', e => {
          this.$message.error('请求照片时发生错误')
        })
        .end()
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
            // 渲染照片要用到image-module插件，但官方的docxtemplater-image-module收费，网上找到一个免费的docxtemplater-image-module-free
            // 创建Docxtemplater实例的时候要传入imageOpts选项。因为要从URL获取照片，所以在这个选项里定义了getImage方法。同时定义了getSize用于确定照片大小。
            const photo = response.data?.idCode ? getPhoto(response.data?.idCode, 'small') : ''
            const imageOpts = {
              getImage: (tagValue, tagName) => {
                // console.log(tagValue, tagName)
                // tagValue is "https://docxtemplater.com/xt-pro-white.png"
                // tagName is "image"

                return new Promise((resolve, reject) => {
                  this.getHttpData(tagValue, function(err, data) {
                    if (err) {
                      return reject(err)
                    }
                    resolve(data)
                  })
                })
              },
              getSize: function(img, tagValue, tagName) {
                // console.log(tagValue, tagName)
                // img is the value that was returned by getImage
                // This is to force the width to 600px, but keep the same aspect ratio
                const sizeOf = require('image-size')
                const sizeObj = sizeOf(img)
                // console.log(sizeObj)
                const forceWidth = 135
                const ratio = forceWidth / sizeObj.width
                return [
                  forceWidth,
                  // calculate height taking into account aspect ratio
                  Math.round(sizeObj.height * ratio)
                ]
                // return [134, 192]
              },
              centered: true
            }
            const zip = new PizZip(content)
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, modules: [new ImageModule(imageOpts)] })
            // doc.attachModule(new ImageModule(imageOpts))
            const fullTimeEdu = response.data.fullTimeDegree ? response.data.fullTimeEdu + '\n' + response.data.fullTimeDegree : response.data.fullTimeEdu
            const partTimeEdu = response.data.partTimeDegree ? response.data.partTimeEdu + '\n' + response.data.partTimeDegree : response.data.partTimeEdu
            let fullTimeSchool = response.data.fullTimeSchool ? response.data.fullTimeSchool + (response.data.fullTimeMajor ? '\n' + response.data.fullTimeMajor : '') : ''
            const partTimeSchool = response.data.partTimeSchool ? response.data.partTimeSchool + (response.data.partTimeMajor ? '\n' + response.data.partTimeMajor : '') : ''
            if (response.data.fullTimeEdu === '小学' || response.data.fullTimeEdu === '初中' || response.data.fullTimeEdu === '高中') {
              fullTimeSchool = ''
            }
            // 找到现任职务
            let post = ''
            response.posts.reduce((pre, cur, index, array) => {
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

            const family = response.family.map(i => {
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
            const resume = []
            const resumeList = this.getResumeList(response.data.resume)
            for (const i in resumeList) {
              if ('cum' in resumeList[i]) {
                continue
              }
              resume.push({ content: formatResume(i, resumeList[i], resumeList, 'YYYY.MM') })
            }
            // const award = response.awards.map(i => {
            //   const content = dayjs(i.getTime).format('YYYY.MM') + '  ' + this.getAwardName(i)
            //   return { content }
            // })
            // 处理奖惩情况
            // const award = response.awards.map(i => dayjs(i.getTime).format('YYYY.MM') + ' ' + this.getAwardName(i)).join(';')
            const award = response.awards.map(i => {
              if (i.category === 1 && i.grade !== 1) {
                return dayjs(i.getTime).format('YYYY年MM月') + '某某单位' + '记' + this.getAwardName(i) + '一次'
              }
              return dayjs(i.getTime).format('YYYY年MM月') + ' ' + this.getAwardName(i)
            }).join(';')
            const disciplines = response.disciplines.map(i => dayjs(i.getTime).format('YYYY年MM月') + '经' + i.organ + '批准' + '受到' + i.dictName + '处分').join(';')
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
            let appraisal = ''
            response.appraisals.forEach(i => {
              if (appraisal !== '') {
                appraisal += ';'
              }
              appraisal += i.years + '年年度考核为' + i.conclusion
            })
            appraisal += '。'
            const docData = {
              name: response.data.name,
              gender: response.data.gender,
              birthday: dayjs(response.data.birthday).format('YYYY.MM'),
              age: getAge(dayjs(response.data.birthday).format('YYYY-MM-DD')),
              nation: response.data.nation,
              hometown: response.data.hometown,
              birthplace: response.data.birthplace,
              joinPartyDay: dayjs(response.data.joinPartyDay).year() === 1 ? '' : dayjs(response.data.joinPartyDay).format('YYYY.MM'),
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
              awardAndPunish,
              appraisal,
              image: photo
            }

            // doc.setData(docData)

            // 因为涉及到照片，这里选择异步渲染文档
            doc.renderAsync(docData)
            // doc.render(imageData)
              .then(() => {
                const buffer = doc.getZip().generate({
                  type: 'blob',
                  mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  // type: 'nodebuffer',
                  // compression: 'DEFLATE'
                })
                saveAs(buffer, response.data.name + '干审表.docx')
              })
              .catch(error => {
                console.log('发生错误:', error)
                this.$message.error(error)
              })
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
