<!--
 * @Author: truxcoder
 * @Date: 2022-02-07 18:11:48
 * @LastEditTime: 2022-03-23 17:32:35
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div>
    <div class="flex">
      <div class=" w-80 tree-zone">
        <el-card>
          <department-tree @nodeClick="nodeClick" />
        </el-card>
      </div>
      <div class=" flex-1">
        <el-card class=" ml-4">
          <el-transfer v-model="selectData" filterable :titles="titles" :filter-method="filterMethod" :props="props" filter-placeholder="请输入人员姓名" :data="currentData" />
          <div class=" mt-4 font-semibold">
            <h2>人员预览</h2>
          </div>
          <div class=" mt-4">
            <el-input :value="finalData" type="textarea" autosize placeholder="已选人员预览" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/api/index'
import DepartmentTree from '@/components/department/DepartmentTree.vue'
import { permission_mixin } from '@/common/mixin/permission'

export default {
  name: 'DepartmentTransfer',
  components: { DepartmentTree },
  mixins: [permission_mixin],
  data() {
    return {
      originData: [],
      currentData: [],
      selectData: [],
      props: { key: 'id', label: 'name' },
      titles: ['待选人员', '已选人员']
    }
  },
  computed: {
    departmentMap() {
      const map = {}
      this.$store.getters.departments.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    personnelMap() {
      const map = {}
      this.originData.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    finalData() {
      return this.selectData.length > 0 ? this.selectData.map(item => this.personnelMap[item].name).join(', ') : '无数据'
    }
  },
  created() {
    this.check().then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData() {
      const data = { personnelId: this.$store.getters.id, organId: this.$store.getters.organ }
      this.listLoading = true
      request('personnel', 'name_list', data).then(response => {
        this.originData = response.data ?? []
        // this.currentData = this.originData.length ? [...this.originData] : []
        this.listLoading = false
      })
    },
    nodeClick(id) {
      const start = Date.now()
      console.log('---id:', id)
      const levelCode = this.departmentMap[id]?.levelCode ?? ''
      const dep = this.$store.getters.departments.filter(item => item.levelCode.indexOf(levelCode) > -1).map(item => item.id)
      this.currentData = this.originData.filter(item => dep.includes(item.departmentId))
      const end = Date.now()
      console.info('所用时间:', end - start)
    },
    filterMethod(query, item) {
      return item.name.indexOf(query) > -1
    }
  }
}
</script>

<style lang="scss" scoped>
/* .el-transfer-panel__list.is-filterable {
  height: 400px !important;
}

.el-transfer-panel {
  height: 500px !important;
} */
.tree-zone ::v-deep .collapse-transition {
  transition: none;
}
</style>
