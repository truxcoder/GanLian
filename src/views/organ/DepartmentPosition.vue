<!--
 * @Author: truxcoder
 * @Date: 2021-11-11 17:03:21
 * @LastEditTime: 2022-06-28 09:32:48
 * @LastEditors: truxcoder
 * @Description: 机构职数管理
-->
<template>
  <div class="app-container">
    <div class="tableZone">
      <el-table
        v-loading="listLoading"
        :data="queryMeans === 'backend' ? currentData : currentPageData"
        element-loading-text="Loading"
        stripe
        :height="height"
        :fit="true"
        highlight-current-row
      >
        <el-table-column align="center" label="名称" prop="shortName" />
        <el-table-column align="center" label="副厅(占用数/编制数)">
          <template slot-scope="scope">
            <div v-if="currentEditIndex !== scope.$index" class="flex justify-center items-center content-center">
              <div :class="getStyle(scope.row, 'ft')">{{ getUse(scope.row.id, 'ft') }}</div>
              <div class="right-button">{{ getNumber(scope.row.position, 'ft') }}</div>
            </div>
            <!-- <span v-if="currentEditIndex !== scope.$index">{{ getUse(scope.row.id, 'zc') }} / {{ getNumber(scope.row.position, 'zc') }}</span> -->
            <el-input v-else v-model.number="form.ft" size="mini" class=" w-14" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="正处(占用数/编制数)">
          <template slot-scope="scope">
            <div v-if="currentEditIndex !== scope.$index" class="flex justify-center items-center content-center">
              <div :class="getStyle(scope.row, 'zc')">{{ getUse(scope.row.id, 'zc') }}</div>
              <div class="right-button">{{ getNumber(scope.row.position, 'zc') }}</div>
            </div>
            <!-- <span v-if="currentEditIndex !== scope.$index">{{ getUse(scope.row.id, 'zc') }} / {{ getNumber(scope.row.position, 'zc') }}</span> -->
            <el-input v-else v-model.number="form.zc" size="mini" class=" w-14" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="副处(占用数/编制数)">
          <template slot-scope="scope">
            <div v-if="currentEditIndex !== scope.$index" class="flex justify-center items-center content-center">
              <div :class="getStyle(scope.row, 'fc')">{{ getUse(scope.row.id, 'fc') }}</div>
              <div class="right-button">{{ getNumber(scope.row.position, 'fc') }}</div>
            </div>
            <el-input v-else v-model.number="form.fc" size="mini" class=" w-14" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="正科(占用数/编制数)">
          <template slot-scope="scope">
            <div v-if="currentEditIndex !== scope.$index" class="flex justify-center items-center content-center">
              <div :class="getStyle(scope.row, 'zk')">{{ getUse(scope.row.id, 'zk') }}</div>
              <div class="right-button">{{ getNumber(scope.row.position, 'zk') }}</div>
            </div>
            <el-input v-else v-model.number="form.zk" size="mini" class=" w-14" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="副科(占用数/编制数)">
          <template slot-scope="scope">
            <div v-if="currentEditIndex !== scope.$index" class="flex justify-center items-center content-center">
              <div :class="getStyle(scope.row, 'fk')">{{ getUse(scope.row.id, 'fk') }}</div>
              <div class="right-button">{{ getNumber(scope.row.position, 'fk') }}</div>
            </div>
            <el-input v-else v-model.number="form.fk" size="mini" class=" w-14" />
          </template>
        </el-table-column>
        <el-table-column v-if="can.manage" align="center" label="操作" width="90">
          <template slot-scope="scope">
            <el-button v-if="currentEditIndex === scope.$index" size="mini" type="primary" @click="onUpdateSubmit(scope.$index, scope.row)">确定</el-button>
            <el-button v-if="currentEditIndex !== scope.$index" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { request } from '@/api/index'
import { common_mixin } from '@/common/mixin/mixin'
import { list_mixin } from '@/common/mixin/list'
import { search_mixin } from '@/common/mixin/search'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'DepartmentPosition',
  mixins: [common_mixin, list_mixin, permission_mixin, search_mixin],
  data() {
    return {
      resource: 'department',
      queryMeans: 'frontend',
      originData: [],
      currentData: [],
      positionData: [],
      organMap: {},
      currentEditIndex: -1,
      form: { ft: 0, zc: 0, fc: 0, zk: 0, fk: 0, g4: 0, g3: 0, g2: 0, g1: 0, z2: 0, z1: 0 },
      searchForm: { personnelId: '', organId: '', years: '', season: '', conclusion: '' },
      searchItemWidth: { width: '130px' }
    }
  },
  computed: {
    positionMap() {
      const map = {}
      this.positionData.forEach(i => {
        map[i.organId] = i
      })
      return map
    },
    currentPageData() {
      if (this.can.global) {
        // return this.currentData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        return this.currentData
      }
      return this.currentData.filter(item => item.id === this.$store.getters.organ)
    },
    height() {
      return window.window.innerHeight - 100
    }
  },
  created() {
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(data = {}, params = {}) {
      this.listLoading = true
      params = this.buildParams(this.queryMeans)
      request('department', 'position', data, params).then(response => {
        if (response.data) {
          this.originData = response.data
          this.currentData = [...this.originData]
          this.positionData = response.position
        } else {
          this.originData = []
          this.currentData = []
        }
        this.listLoading = false
      })
    },
    onUpdateSubmit(index, row) {
      const position = JSON.stringify(this.form)
      if (position === row.position) {
        this.$message.info('未更改数据')
        this.resetUpdateForm()
        return false
      }
      const data = { id: row.id, position }
      const params = { field: 'position' }
      console.log('data:', data)
      console.log('params:', params)
      this.dialogLoading = true
      request('department', 'update', data, params).then(response => {
        this.$message.success(response.message)
        if (this.can.global) {
          this.$set(row, 'position', position)
        } else {
          this.fetchData()
        }

        this.resetUpdateForm()
        this.dialogLoading = false
      })
        .catch(err => {
          console.log(err)
          this.resetUpdateForm()
          this.dialogLoading = false
        })
    },
    handleUpdate(index, row) {
      // console.log(index, row)
      if (this.currentEditIndex !== -1) {
        this.$message.error('一次只能编辑一条信息！')
        return
      }
      this.currentEditIndex = index
      this.form = row.position ? JSON.parse(row.position) : { ft: 0, zc: 0, fc: 0, zk: 0, fk: 0, g4: 0, g3: 0, g2: 0, g1: 0, z2: 0, z1: 0 }
    },
    resetUpdateForm() {
      this.form = { ft: 0, zc: 0, fc: 0, zk: 0, fk: 0, g4: 0, g3: 0, g2: 0, g1: 0, z2: 0, z1: 0 }
      this.currentEditIndex = -1
    },
    getNumber(p, key) {
      if (p) {
        const temp = JSON.parse(p)
        return temp[key]
      }
      return 0
    },
    getUse(id, key) {
      if (id === '68d1150ddfa247f8a129589a6d4dfbbd') {
        return this.positionData.reduce((pre, cur) => pre + cur[key], 0)
      }
      if (!(id in this.positionMap)) {
        return 0
      }
      return this.positionMap[id][key]
    },
    getStyle(row, key) {
      return this.getUse(row.id, key) > this.getNumber(row.position, key) ? 'left-danger-button' : 'left-button'
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
/* .left-button {
  background: #e6f5f0;
  color: #096;
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #99d6c2;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right-color: rgba(255,255,255,.5);
  margin-right: -1px;
} */
.left-button {
  background: #eee;
  color: #666;
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #ccc;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right-color: rgba(255,255,255,.5);
  margin-right: -1px;
}
.left-danger-button {
  background: #fff0f0;
  color: #f66;
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #ffc2c2;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: none;
}
.right-button {
  background: #e6f5fa;
  color: #09c;
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #99d6eb;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left-color: rgba(255,255,255,.5);
}
</style>
