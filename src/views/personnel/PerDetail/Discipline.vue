<template>
  <div>
    <div class=" flex items-center text-left">
      <el-button type="primary" size="mini" @click="addVisible = true">添加信息</el-button>
      <el-button v-if="mainData.length" type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" size="mini" @click="deleteMutiData">删除</el-button>
    </div>
    <div v-if="mainData.length" class="mt-4">
      <el-table v-loading="loading" :data="mainData" element-loading-text="Loading" stripe border :fit="true" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column label="处分类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.category && options.category[scope.row.category - 1] && options.category[scope.row.category - 1].label }}
          </template>
        </el-table-column>
        <el-table-column label="处分项" align="center">
          <template slot-scope="scope">
            {{ scope.row.dictName }}
          </template>
        </el-table-column>
        <el-table-column label="处分时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.getTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="剩余影响期" align="center">
          <template slot-scope="scope">
            {{ scope.row.deadline | deadlineFilter }}
          </template>
        </el-table-column>
        <el-table-column label="处分文号" align="center">
          <template slot-scope="scope">
            {{ scope.row.docNumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="can.update" size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button v-if="can.delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">
              删除
            </el-button>
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class=" mt-4 pl-1 text-gray-600">暂无数据</div>
    <discipline-add
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :visible="addVisible"
      :options="options"
      :dis-dict="disDict"
      @addSuccess="addSuccess"
      @visibleChange="visibleChange"
    />
    <discipline-update
      :is-single="true"
      :single-personnel-data="singlePersonnelData"
      :visible="updateVisible"
      :options="options"
      :dis-dict="disDict"
      :rowdata="rowData"
      @updateSuccess="updateSuccess"
      @visibleChange="visibleChange"
    />
    <discipline-detail :visible="detailVisible" :is-single="true" :single-personnel-data="singlePersonnelData" :dis-dict="disDict" :options="options" :row="rowData" @visibleChange="visibleChange" />
  </div>
</template>

<script>
import DisciplineAdd from '@/views/incorruption/DisciplineAdd.vue'
import DisciplineUpdate from '@/views/incorruption/DisciplineUpdate.vue'
import DisciplineDetail from '@/views/incorruption/DisciplineDetail.vue'

import { mixin } from '@/common/mixin/personnel_detail'
import { detail_permission_mixin } from '@/common/mixin/permission'
import { common_mixin } from '@/common/mixin/mixin'
import { request } from '@/api'

export default {
  name: 'Discipline',
  components: { DisciplineAdd, DisciplineUpdate, DisciplineDetail },
  mixins: [mixin, detail_permission_mixin, common_mixin],
  data() {
    return {
      cpnName: 'Discipline',
      resource: 'discipline',
      obj: 'Discipline',
      disDict: [],
      detailVisible: false
    }
  },
  computed: {
    options() {
      const categoryOptions = [
        { label: '党纪处分', value: 1 },
        { label: '政务处分', value: 2 }
      ]
      return {
        organ: this.$store.getters.organs,
        category: categoryOptions
      }
    }
  },
  created() {
    if (this.$store.state.department.departments.length === 0) {
      this.$store.dispatch('department/setDepartments')
    }
    this.fetchDictData()
  },
  methods: {
    fetchDictData() {
      request('dis_dict', 'list').then(response => {
        this.disDict = response.data
      })
    },
    handleDetail(row) {
      this.rowData = row
      this.detailVisible = true
    },
    dictChange() {
      this.fetchDictData()
    },
    detailClose() {
      this.detailVisible = false
    }
  }
}
</script>

<style></style>
