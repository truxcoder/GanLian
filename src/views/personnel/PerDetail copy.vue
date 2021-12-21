<template>
  <el-container>
    <el-main>
      <el-card class="outside text-sm">
        <div class="px-4 h-12 flex items-center text-left border border-gray-300 rounded-sm bg-red-50">
            <span>人员基本情况</span>
        </div>
        <div class="flex mt-2">
          <div class="flex-none">
            <div class="photoZone border border-gray-300 mr-4 p-4">
              <img :src="photoURL" alt="" class="photo" />
            </div>
          </div>
          <div class="flex-auto w-full">
            <table
              v-loading="loading"
              class="border-separate rounded-sm mainTable w-full"
            >
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
            </table>
          </div>
        </div>
        <div class="mt-4 text-left border border-gray-300 rounded-sm">
          <div class="h-12 flex items-center px-4 bg-green-50">
            <span class=" font-semibold">取得专业证书情况</span>
          </div>
          <hr class="border-gray-300" />
          <div class="h-12 p-4">
            <pre>{{ originData.proCert }}</pre>
          </div>
        </div>
        <div class="mt-4 text-left border border-gray-300 rounded-sm">
          <div class="h-12 flex items-center px-4 bg-green-50">
            <span>参加培训情况</span>
          </div>
          <hr class="border-gray-300" />
          <div class="h-12 p-4">
            <pre>{{ originData.training }}</pre>
          </div>
        </div>
        <div class="mt-4 text-left border border-gray-300 rounded-sm">
          <div class="h-12 flex items-center px-4 bg-green-50">
            <span>个人简历</span>
          </div>
          <hr class="border-gray-300" />
          <div class=" p-4">
            <pre>{{ originData.resume }}</pre>
          </div>
        </div>

        <div class="mt-4">
          <el-table
            v-loading="loading"
            :data="posts"
            element-loading-text="Loading"
            stripe
            border
            :fit="true"
            highlight-current-row
          >
            <el-table-column align="center" label="担任职务" width="150">
              <template slot-scope="scope">
                {{ scope.row.positionName }}
              </template>
            </el-table-column>          
            <el-table-column align="center" label="任职部门">
              <template slot-scope="scope">
                {{ scope.row.departmentName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="任职单位">
              <template slot-scope="scope">
                {{ scope.row.organName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="级别">
              <template slot-scope="scope">
                {{ scope.row.levelName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="任职开始时间">
              <template slot-scope="scope">
                {{ scope.row.startDay | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="任职结束时间">
              <template slot-scope="scope">
                {{ scope.row.endDay | dateFilter }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="mt-4 px-4 h-12 flex items-center text-left border border-gray-300 rounded-sm bg-red-50">
            <span>奖励情况</span>
            <el-button type="primary" size="mini">添加信息</el-button>
            <el-button type="success" size="mini">编辑信息</el-button>
        </div>

        <div class="mt-4">
          <el-table
            v-loading="loading"
            :data="awards"
            element-loading-text="Loading"
            stripe
            border
            :fit="true"
            highlight-current-row
          >
            <el-table-column align="center" label="奖励类型" width="150">
              <template slot-scope="scope">
                {{ options.category[scope.row.category-1] && options.category[scope.row.category-1].label }}
              </template>
            </el-table-column>          
            <el-table-column align="center" label="奖励项/等级">
              <template slot-scope="scope">
                {{ options.grade[scope.row.grade-1] && options.grade[scope.row.grade-1].label }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖励时间">
              <template slot-scope="scope">
                {{ scope.row.getTime | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖励文号">
              <template slot-scope="scope">
                {{ scope.row.docNumber }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="mt-4">
          <el-table
            v-loading="loading"
            :data="appraisals"
            element-loading-text="Loading"
            stripe
            border
            :fit="true"
            highlight-current-row
          >           
            <el-table-column align="center" label="考核时间">
              <template slot-scope="scope">
                {{ scope.row.years }}年
              </template>
            </el-table-column>
            <el-table-column align="center" label="考核结果">
              <template slot-scope="scope">
                {{ scope.row.conclusion }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="考核单位">
              <template slot-scope="scope">
                {{ scope.row.organName }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import dayjs from 'dayjs'
import 'tailwindcss/tailwind.css'
import { getAge } from '@/utils/index'
import { personnelDetail } from '@/api/personnel'
import { getPostDetail } from '@/api/post'
import { getAppraisalDetail } from '@/api/appraisal'
import { awardDetail } from '@/api/award'

export default {
  name: 'Pdetail',
  filters: {
    ageFilter(age) {
      return getAge(dayjs(age).format('YYYY-MM-DD'))
    },
    dateFilter(date) {
      return dayjs(date).format('YYYY年MM月DD日')
    }
  },
  data() {
    return {
      dialogLoading: false,
      today: dayjs().format('YYYY年MM月DD日'),
      departmentList: [],
      originData: {},
      posts: [],
      appraisals: [],
      awards: [],
      postNumber: 0,
      loading: true
    }
  },
  computed: {
    photoURL() {
      // return this.$store.getters.staticURL+"/static/lxb2.jpg"
      return '/image/lxb2.jpg'
    },
    options() {
      let categoryOptions = [{ label:'年度奖励', value: 1}, { label:'专项表彰', value: 2}, ]
      let gradeOptions = [{ label:'授予称号', value: 1}, { label:'一等功', value: 2}, { label:'二等功', value: 3}, 
        { label:'三等功', value: 4}, { label:'嘉奖', value: 5}, { label:'国家级', value: 6}, { label:'省部级', value: 7}, 
        { label:'市厅级', value: 8}, { label:'局级', value: 9}, { label:'所级', value: 10} ]
      return {
        category: categoryOptions,
        grade: gradeOptions
      }
    }
  },
  created() {
    this.fetchAllData({ id: this.$route.query.id })
  },
  methods: {
    fetchAllData(params = {}){
      this.listLoading = true
      let promises = [ personnelDetail(params),getPostDetail(params),getAppraisalDetail(params),awardDetail(params) ]
      Promise.all(promises).then( responses => {
        this.originData = responses[0].data
        this.posts = responses[1].data
        this.appraisals = responses[2].data
        this.awards = responses[3].data
        this.loading = false
      })
    },
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
