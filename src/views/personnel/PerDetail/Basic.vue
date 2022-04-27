<template>
  <div v-loading="loading">
    <div class="flex mt-2">
      <div class="flex-none">
        <div v-loading="photoLoading" class="photoZone ">
          <!-- <img :src="photoURL" alt class="photo" /> -->
          <el-image fit="fit" :src="photoURL" class="photo">
            <div slot="error" class="image-slot">
              <img src="photo.jpg" alt class="photo" />
            </div>
          </el-image>
        </div>
        <div class=" mt-2 mr-4">
          <el-button v-if="can.update" size="mini" type="primary" plain style="width:100%" @click="handleEdit('update', baseData)">修改人员信息</el-button>
          <!-- <button class="text-base font-medium rounded-lg w-full py-1 bg-blue-500 text-white" @click="handleUpdate">修改人员信息</button> -->
        </div>
        <div class=" mt-2 mr-4">
          <el-button v-if="can.update" class="w-full" type="primary" size="mini" plain @click="onPhotoSync">从大数据中心同步照片</el-button>
        </div>
      </div>
      <div class="flex-auto w-full">
        <el-descriptions class="margin-top" title="" :column="3" border>
          <!-- <template slot="extra">
            <el-button type="primary" size="small">操作</el-button>
          </template> -->
          <el-descriptions-item v-for="item in models" :key="item.field" :label="item.label">
            <div v-if="item.field === 'political' && baseData[item.field] === '中共党员'" class=" flex justify-start items-center">
              <!-- <span>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path
                    d="M512.556671 129.744026c197.421548 74.05659 317.217127 310.776893 214.592906 502.575854L476.712573 380.614735l95.599384-95.966135-59.789263-59.522044c-32.990033 32.322485-85.420485 39.213813-120.779911 24.963475l-190.347544 190.53082 107.797713 107.430362 71.853683-71.586864 250.353061 251.287427c-122.514535 67.298172-292.337595 46.089551-417.672818-84.151745l-60.690252 60.523765c18.188668 25.213905 33.423739 48.058217 52.363298 67.214229-1.65188 1.985654-6.85835 6.257757-6.958282 6.374678-3.187439-0.517649-6.958282-1.751812-10.312408-1.751812-32.289108 0-58.370825 28.116737-58.370825 60.439822 0 32.27212 26.332147 58.604066 58.621055 58.604066 32.306096 0 59.939161-26.565788 59.939161-58.870886 0-3.771443-0.850823-7.209112-1.501982-10.763702l9.328076-9.160789c144.091506 97.217886 302.016433 109.332473 471.938825 7.608841l70.168226 70.452034 96.049678-94.781538-70.61892-71.3864C1026.345921 422.565692 756.117936 122.435381 512.556671 129.744026L512.556671 129.744026 512.556671 129.744026z"
                    p-id="2371"
                    fill="#d81e06"
                  />
                </svg>
              </span> -->
              <i class="el-icon-scjd-emblem-party-fill iconfont text-red-600 text-sm pr-1" />
              <span>中共党员</span>
            </div>
            <span v-else-if="item.field === 'isSecret'">{{ baseData.isSecret === 2 ? '是' : '否' }}</span>
            <span v-else-if="item.field === 'age'">{{ baseData.birthday | ageFilter }}</span>
            <span v-else-if="item.field === 'passport'">{{ baseData.passport | passportFilter }}</span>
            <span v-else-if="item.type === 'date'">{{ baseData[item.field] | dateFilter }}</span>
            <span v-else>{{ baseData[item.field] }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="mt-4 text-left border border-gray-300 rounded-sm">
      <div class="h-12 flex items-center px-4 bg-blue-50">
        <span>取得专业证书情况</span>
      </div>
      <hr class="border-gray-300" />
      <div class="min-h-0 p-4">
        <span>{{ baseData.proCert }}</span>
      </div>
    </div>
    <div class="mt-4 text-left border border-gray-300 rounded-sm">
      <div class="h-12 flex items-center px-4 bg-blue-50 justify-between">
        <span>个人简历</span>
        <el-button v-if="can.update" type="text" @click="resumeVisible = true">编辑</el-button>
      </div>
      <hr class="border-gray-300" />
      <div class="p-4">
        <!-- <pre>{{ baseData.resume }}</pre> -->
        <!-- <li v-for="(v, k) in resumeList" v-show="isShow(v)" :key="k" class="list-none">{{ v.start | dateFilter }}-{{ v.end | dateFilter }} {{ v.organ }}{{ v.dept }} {{ v.post }}</li> -->
        <li v-for="(v, k) in resumeList" v-show="isShow(v)" :key="k" class="list-none">{{ formatResume(k, v) }}</li>
      </div>
    </div>
    <PersonnelEdit :visible="editVisible" :action="action" :row="baseData" @editSuccess="updateSuccess" @visibleChange="visibleChange" />

    <!-- <personnel-update :visible="updateVisible" :rowdata="baseData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" /> -->
    <ResumeEdit :visible="resumeVisible" :personnel-id="baseData.id" :resume="baseData.resume" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAge } from '@/utils/index'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelEdit from '@/views/personnel/PerEdit.vue'
import ResumeEdit from '@/views/personnel/ResumeEdit.vue'

import { getPhoto } from '@/utils/personnel'
import { passportDict } from '@/utils/dict'

import { truxGet } from '@/api/common'

const defaultSettings = require('@/settings.js')

export default {
  name: 'Basic',
  components: { PersonnelEdit, ResumeEdit },
  filters: {
    ageFilter(age) {
      return getAge(dayjs(age).format('YYYY-MM-DD'))
    },
    dateFilter(date) {
      if (date === '') {
        return '今'
      }
      if (dayjs(date).year() === 1) {
        return ''
      }
      return dayjs(date).format('YYYY年MM月')
    },
    passportFilter(passport) {
      passport = passport ?? ''
      if (passport === '') {
        return '无'
      }
      const _map = new Map()
      passportDict.forEach(i => {
        _map.set(i.value, i.label)
      })
      const temp = JSON.parse(passport)
      if (Array.isArray(temp)) {
        return temp.map(i => _map.get(i)).join(', ')
      }
      return '错误'
    }
  },
  mixins: [permission_mixin],
  props: {
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    baseData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      obj: 'DetailBasic',
      resource: 'personnel',
      action: '',
      now: '',
      // photoURL: '',
      editVisible: false,
      resumeVisible: false,
      photoLoading: false,
      models: [
        { label: '姓名', field: 'name' },
        { label: '编号', field: 'policeCode' },
        { label: '性别', field: 'gender' },
        { label: '民族', field: 'nation' },
        { label: '所属单位', field: 'organName' },
        { label: '所在部门', field: 'departmentName' },
        { label: '身份证号码', field: 'idCode' },
        { label: '政治面貌', field: 'political' },
        { label: '通讯方式', field: 'phone' },
        { label: '岗位是否涉密', field: 'isSecret' },
        { label: '年龄', field: 'age' },
        { label: '出生日期', field: 'birthday', type: 'date' },
        { label: '籍贯', field: 'hometown' },
        { label: '出生地', field: 'birthplace' },
        { label: '健康状况', field: 'health' },
        { label: '入党日期', field: 'joinPartyDay', type: 'date' },
        { label: '参加工作日期', field: 'startJobDay', type: 'date' },
        { label: '录警日期', field: 'bePoliceDay', type: 'date' },
        { label: '全日制教育学历', field: 'fullTimeEdu' },
        { label: '全日制教育专业', field: 'fullTimeMajor' },
        { label: '全日制毕业院校', field: 'fullTimeSchool' },
        { label: '非全日制教育学历', field: 'partTimeEdu' },
        { label: '非全日制教育专业', field: 'partTimeMajor' },
        { label: '非全日制毕业院校', field: 'partTimeSchool' },
        { label: '通过县处级考试时间', field: 'passExamDay', type: 'date' },
        { label: '持有护照情况', field: 'passport' },
        { label: '专业技术职务', field: 'technicalTitle' },
        { label: '专长', field: 'specialty' }
      ]
    }
  },
  computed: {
    photoURL() {
      return this.baseData?.idCode ? getPhoto(this.baseData?.idCode, 'small') + '?now=' + this.now : ''
    },
    resumeList() {
      const resume = this.baseData.resume ?? ''
      let result = []

      if (resume === '') {
        return []
      }
      result = JSON.parse(resume)
      return result
    }
  },
  created() {
    this.check(this.obj).then(() => {

    })
  },
  methods: {
    visibleChange(cpn) {
      const visible = cpn + 'Visible'
      this[visible] = false
    },
    handleEdit(act, row) {
      this.action = act
      if (act === 'add') {
        this.rowData = {}
      } else {
        this.rowData = row
      }
      this.editVisible = true
    },
    updateSuccess() {
      this.editVisible = false
      this.$emit('updateSuccess')
    },
    resumeVisibleChange() {
      this.resumeVisible = false
    },
    editSuccess() {
      this.resumeVisible = false
      this.$emit('updateSuccess')
    },
    onPhotoSync() {
      this.$confirm('同步照片后新照片将会覆盖已有照片, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.photoLoading = true
          const data = { id: this.baseData.id, userId: this.baseData.userId, idCode: this.baseData.idCode }
          truxGet(defaultSettings.uploadURL, 'sync', '', data).then(res => {
            this.now = Date.now()
            this.$message.success(res.message)
            this.photoLoading = false
          }).catch(() => {
            this.photoLoading = false
          })
        })
        .catch(() => {
          this.$message.info('已取消同步')
        })
    },
    isShow(v) {
      if ('cum' in v) {
        return false
      }
      return true
    },
    dateFormat(date) {
      if (date === '') {
        return '今'
      }
      if (dayjs(date).year() === 1) {
        return ''
      }
      return dayjs(date).format('YYYY年MM月')
    },
    formatResume(k, v) {
      if ('cum' in v) {
        return ''
      }
      let work = ''
      if ('main' in v) {
        for (let index = k; index < this.resumeList.length; index++) {
          const element = this.resumeList[index]
          if (index === k) {
            work = element.organ + element?.dept + element?.post
            continue
          }
          if (!('cum' in element)) {
            break
          }
          if (element.organ === this.resumeList[index - 1].organ) {
            work = work + '、' + element?.dept + element?.post
          } else {
            work = work + '兼' + element.organ + element?.dept + element?.post
          }
        }
      } else {
        work = v.organ + v?.dept + v?.post
      }
      return this.dateFormat(v.start) + '-' + this.dateFormat(v.end) + ' ' + work
    }
  }
}
</script>

<style scoped>
.outside {
  margin: 0 auto;
  text-align: center;
}
.photoZone {
  @apply flex border border-gray-300 mr-4 p-4 justify-center items-center
}

/* .photoZone {
  position: relative;
  width: 220px;
  height: 300px;
  @apply border border-gray-300 mr-4
}
.photo_button {
  position: absolute;
  width: 200px;
  height: 28px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
} */
.photo {
  width: 200px;
  margin: auto;
}
.mainTable {
  border-spacing: 1px;
  background-color: #ccc;
}
.mainTable tr,
.mainTable td {
  background-color: #fff;
}
.mainTable td {
  padding: 0.5rem;
}
.mainTable td:nth-child(odd) {
  background-color: #fbfbfb;
}
</style>
