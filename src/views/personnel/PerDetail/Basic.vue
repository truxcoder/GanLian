<template>
  <div v-loading="loading">
    <div v-if="baseData.remark" class="flex my-2 text-red-600 bg-blue-50 border border-gray-300 rounded-sm px-4 py-2">
      <div>{{ baseData.remark }}</div>
    </div>
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
        <div v-if="isNormal" class=" mt-2 mr-4">
          <el-button class="w-full" type="primary" size="mini" plain @click="feedbackVisible = true">错误信息反馈</el-button>
        </div>
        <div v-if="can.manage" class=" mt-2 mr-4">
          <el-button class="w-full" type="primary" size="mini" plain @click="updateBirthdayVisible = true">修改生日</el-button>
        </div>
      </div>
      <div class="flex-auto w-full">
        <el-descriptions class="margin-top" title="" :column="3" border>
          <!-- <template slot="extra">
            <el-button type="primary" size="small">操作</el-button>
          </template> -->
          <el-descriptions-item v-for="item in models" :key="item.field" :label="item.label">
            <div v-if="item.field === 'political' && baseData[item.field] === '中共党员'" class=" flex justify-start items-center">
              <i class="el-icon-scjd-emblem-party-fill iconfont text-red-600 text-sm pr-1" />
              <span>中共党员</span>
            </div>
            <span v-else-if="item.field === 'isSecret'">{{ baseData.isSecret === 2 ? '是' : '否' }}</span>
            <span v-else-if="item.field === 'age'">{{ baseData.birthday | ageFilter }}</span>
            <span v-else-if="item.field === 'passport'">{{ baseData.passport | passportFilter }}</span>
            <span v-else-if="item.type === 'date' || item.type === 'month'">{{ baseData[item.field] | dateFilter(item.type) }}</span>
            <span v-else>{{ baseData[item.field] }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="mt-4 text-left border border-gray-300 rounded-sm">
      <div class="h-12 flex items-center px-4 bg-blue-50 justify-between">
        <span>教育情况</span>
        <el-button v-if="can.update" type="text" @click="eduVisible = true">编辑</el-button>
      </div>
      <hr class="border-gray-300" />
      <div class="min-h-0 text-base text-gray-600">
        <dl class="main-dl bg-gray-100">
          <dd>教育形式</dd>
          <dd>学历</dd>
          <dd>学位</dd>
          <dd>专业</dd>
          <dd>毕业院校</dd>
        </dl>
        <hr class="border-gray-300" />
        <dl class="main-dl">
          <dd>全日制教育</dd>
          <dd>{{ baseData.fullTimeEdu }}</dd>
          <dd>{{ baseData.fullTimeDegree }}</dd>
          <dd>{{ baseData.fullTimeMajor }}</dd>
          <dd>{{ baseData.fullTimeSchool }}</dd>
        </dl>
        <hr class="border-gray-300" />
        <dl class="main-dl">
          <dd>在职教育</dd>
          <dd>{{ baseData.partTimeEdu }}</dd>
          <dd>{{ baseData.partTimeDegree }}</dd>
          <dd>{{ baseData.partTimeMajor }}</dd>
          <dd>{{ baseData.partTimeSchool }}</dd>
        </dl>
        <hr class="border-gray-300" />
        <dl class="main-dl">
          <dd>最高教育</dd>
          <dd>{{ baseData.finalEdu }}</dd>
          <dd>{{ baseData.finalDegree }}</dd>
          <dd>{{ baseData.finalMajor }}</dd>
          <dd>{{ baseData.finalSchool }}</dd>
        </dl>
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
        <li v-for="(v, k) in resumeList" v-show="isShow(v)" :key="k" class="resume-li"><pre><p class="resume-content">{{ formatResume(k, v, resumeList) }}</p></pre></li>
      </div>
    </div>
    <PersonnelEdit :visible="editVisible" :action="action" :row="baseData" :can="can" @editSuccess="updateSuccess" @visibleChange="visibleChange" />

    <!-- <personnel-update :visible="updateVisible" :rowdata="baseData" @updateSuccess="updateSuccess" @visibleChange="visibleChange" /> -->
    <ResumeEdit :visible="resumeVisible" :personnel-id="baseData.id" :resume="baseData.resume" :can="can" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <PersonnelEduEdit :visible="eduVisible" :row="baseData" :can="can" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <FeedbackEdit :visible="feedbackVisible" :row="baseData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
    <BirthdayEdit :visible="updateBirthdayVisible" :row="baseData" @editSuccess="editSuccess" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAge } from '@/utils/index'
import { permission_mixin } from '@/common/mixin/permission'
import PersonnelEdit from '@/views/personnel/PerEdit.vue'
import ResumeEdit from '@/views/personnel/ResumeEdit.vue'
import PersonnelEduEdit from '@/views/personnel/PersonnelEduEdit.vue'
import FeedbackEdit from './FeedbackEdit.vue'
import BirthdayEdit from './BirthdayEdit.vue'

import { truxGet } from '@/api/common'
import { getPhoto } from '@/utils/personnel'
import { passportDict } from '@/utils/dict'
import { formatResume } from '@/utils/resume'
import { isNormalRole } from '@/utils/permission'

const defaultSettings = require('@/settings.js')

export default {
  name: 'Basic',
  components: { PersonnelEdit, ResumeEdit, PersonnelEduEdit, FeedbackEdit, BirthdayEdit },
  filters: {
    ageFilter(age) {
      return getAge(dayjs(age).format('YYYY-MM-DD'))
    },
    dateFilter(date, type) {
      if (date === '') {
        return '今'
      }
      if (dayjs(date).year() === 1) {
        return ''
      }
      if (type === 'month') {
        return dayjs(date).format('YYYY年MM月')
      } else {
        return dayjs(date).format('YYYY年MM月DD日')
      }
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
      eduVisible: false,
      feedbackVisible: false,
      updateBirthdayVisible: false,
      photoLoading: false,
      formatResume,
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
        // { label: '年龄', field: 'age' },
        { label: '婚姻状况', field: 'marriage' },
        { label: '出生日期', field: 'birthday', type: 'date' },
        { label: '籍贯', field: 'hometown' },
        { label: '出生地', field: 'birthplace' },
        { label: '健康状况', field: 'health' },
        { label: '入党日期', field: 'joinPartyDay', type: 'month' },
        { label: '参加工作日期', field: 'startJobDay', type: 'month' },
        { label: '录警日期', field: 'bePoliceDay', type: 'date' },
        { label: '通过县处级考试时间', field: 'passExamDay', type: 'date' },
        { label: '持有护照情况', field: 'passport' },
        { label: '专业技术职务', field: 'technicalTitle' },
        { label: '专长', field: 'specialty' },
        { label: '专业证书', field: 'proCert' }
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
    },
    isNormal() {
      return isNormalRole(this.$store.getters.roles)
    }
  },
  created() {
    this.check(this.obj).then(() => {
      this.now = Date.now()
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
    editSuccess(cpn) {
      this.visibleChange(cpn)
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
  border-collapse:collapse;
  /* border: 1px solid #ccc; */
  /* border-spacing: 1px; */
  /* background-color: #ccc; */
}
.mainTable tr {
  border-bottom: 1px solid #ccc;
}
.mainTable tr:last-child {
  border-bottom: none!important;
}
.mainTable th {
  background: #efefef;
}
.mainTable tr,
.mainTable td {
  /* background-color: #fff; */
}
.mainTable td {
  padding: 0.5rem;
}
/* .mainTable td:nth-child(odd) {
  background-color: #fbfbfb;
} */
.main-dl {
  display: flex;
  width: 100%;
  height: 3rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.main-dl dd {
  flex: 1 1 0%;
}
.resume-li {
  list-style: none;
}
.resume-li pre {
  list-style: none;
  display:inline;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.resume-content {
  font-family: "宋体", "宋体GB2312", "新宋体", "微软雅黑", "Times New Roman";
}
</style>
