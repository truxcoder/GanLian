<!--
 * @Author: truxcoder
 * @Date: 2022-03-23 10:03:03
 * @LastEditTime: 2022-04-12 10:57:51
 * @LastEditors: truxcoder
 * @Description: 单位选择组件
-->

<template>
  <el-select :value="value" size="small" :style="width" :multiple="multiple" placeholder="请选择单位" @change="onChange">
    <el-option v-for="i in organList" :key="i.id" :label="i.shortName" :value="i.id" />
  </el-select>
</template>

<script>
export default {
  name: 'OrganSelect',
  props: {
    value: {
      // type: String,
      // default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    width: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    organList() {
      return this.$store.getters.organs
    }
  },
  methods: {
    onChange(v) {
      // this.$emit('update:value', v)
      this.$emit('input', v)
    }
  }

}
</script>

<style>

</style>
