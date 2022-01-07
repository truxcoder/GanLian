<template>
  <div>
    <div class="flex mt-2">
      <div class="flex-none">
        <div class="photoZone border border-gray-300 mr-4 p-4">
          <img :src="photoURL" alt class="photo" />
        </div>
        <div class=" mt-1 mr-4">
          <el-button size="mini" type="primary" plain style="width:100%" @click="updateFormVisible = true">修改人员信息</el-button>
          <!-- <button class="text-base font-medium rounded-lg w-full py-1 bg-blue-500 text-white" @click="handleUpdate">修改人员信息</button> -->
        </div>
      </div>
      <div class="flex-auto w-full">
        <el-descriptions class="margin-top" title="" :column="3" border>
          <!-- <template slot="extra">
            <el-button type="primary" size="small">操作</el-button>
          </template> -->
          <el-descriptions-item v-for="item in models" :key="item.field" :label="item.label">
            <div v-if="item.field === 'political' && originData[item.field] === '中共党员'" class=" flex justify-start items-center">
              <span>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path
                    d="M512.556671 129.744026c197.421548 74.05659 317.217127 310.776893 214.592906 502.575854L476.712573 380.614735l95.599384-95.966135-59.789263-59.522044c-32.990033 32.322485-85.420485 39.213813-120.779911 24.963475l-190.347544 190.53082 107.797713 107.430362 71.853683-71.586864 250.353061 251.287427c-122.514535 67.298172-292.337595 46.089551-417.672818-84.151745l-60.690252 60.523765c18.188668 25.213905 33.423739 48.058217 52.363298 67.214229-1.65188 1.985654-6.85835 6.257757-6.958282 6.374678-3.187439-0.517649-6.958282-1.751812-10.312408-1.751812-32.289108 0-58.370825 28.116737-58.370825 60.439822 0 32.27212 26.332147 58.604066 58.621055 58.604066 32.306096 0 59.939161-26.565788 59.939161-58.870886 0-3.771443-0.850823-7.209112-1.501982-10.763702l9.328076-9.160789c144.091506 97.217886 302.016433 109.332473 471.938825 7.608841l70.168226 70.452034 96.049678-94.781538-70.61892-71.3864C1026.345921 422.565692 756.117936 122.435381 512.556671 129.744026L512.556671 129.744026 512.556671 129.744026z"
                    p-id="2371"
                    fill="#d81e06"
                  />
                </svg>
              </span>
              <span>中共党员</span>
            </div>
            <span v-else-if="item.field === 'age'">{{ originData.birthday | ageFilter }}</span>
            <span v-else-if="item.type === 'date'">{{ originData[item.field] | dateFilter }}</span>
            <span v-else>{{ originData[item.field] }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <!-- <table v-loading="loading" class="border-separate rounded-sm mainTable w-full">
          <tr>
            <td>姓名</td>
            <td>{{ originData.name }}</td>
            <td>编号</td>
            <td>{{ originData.policeCode }}</td>
            <td>性别</td>
            <td>{{ originData.gender }}</td>
          </tr>
          <tr>
            <td>民族</td>
            <td>{{ originData.nation }}</td>
            <td>所属单位</td>
            <td>{{ originData.organName }}</td>
            <td>所在部门</td>
            <td>{{ originData.departmentName }}</td>
          </tr>
          <tr>
            <td>身份证号码</td>
            <td>{{ originData.idCode }}</td>
            <td>政治面貌</td>
            <td>{{ originData.political }}</td>
            <td>通讯方式</td>
            <td>{{ originData.phone }}</td>
          </tr>
          <tr>
            <td>岗位是否涉密</td>
            <td>{{ originData.isSecret }}</td>
            <td>年龄</td>
            <td>{{ originData.birthday | ageFilter }}</td>
            <td>出生日期</td>
            <td>{{ originData.birthday | dateFilter }}</td>
          </tr>
          <tr>
            <td>入党日期</td>
            <td>{{ originData.joinPartyDay | dateFilter }}</td>
            <td>参加工作时间</td>
            <td>{{ originData.startJobDay | dateFilter }}</td>
            <td>录警时间</td>
            <td>{{ originData.bePoliceDay | dateFilter }}</td>
          </tr>
          <tr>
            <td>全日制教育</td>
            <td>{{ originData.fullTimeEdu }}</td>
            <td>非全日制教育</td>
            <td>{{ originData.partTimeEdu }}</td>
            <td>全日制专业</td>
            <td>{{ originData.fullTimeMajor }}</td>
          </tr>
        </table> -->
      </div>
    </div>
    <div class="mt-4 text-left border border-gray-300 rounded-sm">
      <div class="h-12 flex items-center px-4 bg-blue-50">
        <span class="font-semibold">取得专业证书情况</span>
      </div>
      <hr class="border-gray-300" />
      <div class="h-12 p-4">
        <pre>{{ originData.proCert }}</pre>
      </div>
    </div>
    <div class="mt-4 text-left border border-gray-300 rounded-sm">
      <div class="h-12 flex items-center px-4 bg-blue-50">
        <span>参加培训情况</span>
      </div>
      <hr class="border-gray-300" />
      <div class="h-12 p-4">
        <pre>{{ originData.training }}</pre>
      </div>
    </div>
    <div class="mt-4 text-left border border-gray-300 rounded-sm">
      <div class="h-12 flex items-center px-4 bg-blue-50 justify-between">
        <span>个人简历</span>
        <el-button type="text" @click="resumeVisible = true">编辑</el-button>
      </div>
      <hr class="border-gray-300" />
      <div class="p-4">
        <!-- <pre>{{ originData.resume }}</pre> -->
        <li v-for="(v, k) in resumeList" :key="k" class="list-none">{{ v.start | dateFilter }}-{{ v.end | dateFilter }} {{ v.organ }}{{ v.dept }} {{ v.post }}</li>
      </div>
    </div>
    <personnel-update :form-visible="updateFormVisible" :rowdata="singlePersonnelData" @updateSuccess="updateSuccess" @updateVisibleChange="updateVisibleChange" />
    <resume-edit :visible="resumeVisible" :personnel-id="originData.id" :resume="originData.resume" @editSuccess="editSuccess" @resumeVisibleChange="resumeVisibleChange" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mixin } from '@/common/mixin/personnel_detail'
import PersonnelUpdate from '@/views/personnel/PerUpdate.vue'
import ResumeEdit from '@/views/personnel/ResumeEdit.vue'

export default {
  name: 'Basic',
  components: { PersonnelUpdate, ResumeEdit },
  filters: {
    dateFilter(date) {
      if (date === '') {
        return '今'
      }
      return dayjs(date).format('YYYY年MM月')
    }
  },
  mixins: [mixin],
  data() {
    return {
      cpnName: 'Basic',
      resumeVisible: false,
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
        { label: '入党日期', field: 'joinPartyDay', type: 'date' },
        { label: '参加工作日期', field: 'startJobDay', type: 'date' },
        { label: '录警日期', field: 'bePoliceDay', type: 'date' },
        { label: '全日制教育', field: 'fullTimeEdu' },
        { label: '非全日制教育', field: 'partTimeEdu' },
        { label: '全日制专业', field: 'fullTimeMajor' }
      ]
    }
  },
  computed: {
    photoURL() {
      // return this.$store.getters.staticURL+"/static/lxb2.jpg"
      // return '/image/lxb2.jpg'
      return 'http://n.sinaimg.cn/spider202011/400/w1000h1000/20200101/2d53-imkzenq6040371.jpg'
    },
    originData() {
      return this.singlePersonnelData
    },
    resumeList() {
      const resume = this.originData.resume ?? ''
      let result = []

      if (resume === '') {
        return []
      }
      result = JSON.parse(resume)
      return result
    }
  },
  methods: {
    resumeVisibleChange() {
      this.resumeVisible = false
    },
    editSuccess() {
      this.resumeVisible = false
      this.$emit('reFetchCpnData', this.cpnName)
    }
  }
}
</script>

<style scoped>
.outside {
  margin: 0 auto;
  text-align: center;
}

.photo {
  width: 200px;
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
