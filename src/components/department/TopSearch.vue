<!--
 * @Author: truxcoder
 * @Date: 2022-03-23 10:56:54
 * @LastEditTime: 2022-03-23 15:45:29
 * @LastEditors: truxcoder
 * @Description: 顶部搜索组件
-->

<template>
  <el-form ref="form" :inline="true" :model="form">
    <el-form-item v-for="item in items" :key="item.key" :label="item.label" :prop="item.key">
      <personnel-option v-if="item.key==='personnelId'" :is-clean="isClean" size="small" :style="item.width ? item.width : itemWidth" @personnelChange="onPersonnelChange" />
      <OrganSelect v-if="item.key==='organId'" v-model="form.organId" />
      <el-select v-if="item.type==='select'" v-model="form[item.key]" size="small" :style="item.width ? item.width : itemWidth" :placeholder="item.placeholder">
        <el-option v-for="i in item.option" :key="i.value" :label="i.label" :value="i.value" />
      </el-select>
      <el-input v-if="item.type==='input'" v-model="form[item.key]" size="small" :style="item.width ? item.width : itemWidth" :placeholder="item.placeholder" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-link icon="el-icon-delete" :underline="false" @click="onClean">清空</el-link>
    </el-form-item>
  </el-form>
</template>

<script>
import PersonnelOption from '@/components/Personnel/PersonnelOption.vue'
import OrganSelect from '@/components/department/OrganSelect.vue'
export default {
  name: 'TopSearch',
  components: { PersonnelOption, OrganSelect },
  props: {
    items: {
      type: Array,
      default() {
        return {}
      }
    },
    searchData: {
      type: Object,
      default() {
        return {}
      }
    },
    queryParam: {
      type: Object,
      default() {
        return {}
      }
    },
    width: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      val: this.value,
      form: {},
      itemWidth: { width: '130px' },
      isClean: false
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    }
  },
  created() {
    this.formInit()
  },
  methods: {
    formInit() {
      this.items.forEach(item => {
        this.form[item?.key] = ''
      })
    },
    onPersonnelChange(value) {
      this.form.personnelId = value
      this.isClean = false
    },
    onSearch() {
      const searchData = {}
      let searchParamNumber = 0
      for (const key in this.form) {
        if (this.form[key] !== '') {
          if (
            Object.prototype.toString.call(this.form[key]) === '[object String]' &&
            (this.form[key].includes("'") || this.form[key].includes('or') || this.form[key].includes('and') || this.form[key].includes('--'))
          ) {
            this.$message.error('查询参数包含非法字符!')
            return false
          }
          // 如果查询key不是organParam，则添加searchData中，否则往fetchData里传一个param，包含单位id, 以便buildParams接收。
          if (key !== 'organParam') {
            searchData[key] = this.form[key]
          } else {
            this.queryParam = { organId: this.form[key] }
          }
          searchParamNumber++
        } else if (key === 'organParam') {
          this.queryParam = {}
        }
      }
      if (!searchParamNumber) {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！'
        })
        return
      }
      this.searchData = searchData
      this.currentPage = 1
      // this.fetchData(searchData, this.queryParam)
      this.$emit('onSearch', searchData, this.queryParam)
      this.$emit('update:queryParam')
      this.$emit('update:searchData', searchData)
      this.onClean()
    },
    // 清空搜索框
    onClean() {
      this.$refs.form.resetFields()
      // this.queryParam = {}
      this.isClean = true
    }
  }

}
</script>

<style>

</style>
