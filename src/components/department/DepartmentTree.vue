<!--
 * @Author: truxcoder
 * @Date: 2021-12-06 14:46:39
 * @LastEditTime: 2022-02-08 17:32:54
 * @LastEditors: truxcoder
 * @Description: 部门树形菜单
-->
<template>
  <el-tree v-if="!loading" ref="selectTree" v-loading="loading" :load="loadNode" lazy :props="props" :expand-on-click-node="false" @node-click="nodeClick" />
  <!-- <el-tree v-if="!loading" ref="selectTree" v-loading="loading" :data="dataList" :props="props" :expand-on-click-node="false" @node-click="nodeClick" /> -->
  <!-- <el-tree :data="dataList" :props="props" /> -->
</template>

<script>
import { detail_permission_mixin } from '@/common/mixin/permission'
export default {
  name: 'DepartmentTree',
  mixins: [detail_permission_mixin],
  props: {
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      obj: 'Personnel',
      list: [],
      loading: true,
      rootNode: '',
      props: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    currentData() {
      console.log('this.can.global:', this.can.global)
      if (this.can.global) {
        return this.$store.getters.departments
      }
      let busOrgCode = ''
      this.$store.getters.organs.forEach(item => {
        if (item.id === this.$store.getters.organ) {
          busOrgCode = item.busOrgCode
        }
      })
      return this.$store.getters.departments.filter(item => item.busOrgCode === busOrgCode)
    },
    departmentList() {
      return this.currentData.map(item => {
        return { id: item.id, name: item.name, parentId: item.parentId }
      })
    },
    organList() {
      return this.$store.getters.organs.map(item => {
        return { id: item.id, name: item.name, parentId: item.parentId }
      })
    },
    departmentMap() {
      const map = {}
      this.currentData.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    dataList() {
      return this.toTree(this.departmentList)
    }
  },
  watch: {
    expand: function(val, oldval) {
      if (val === true) {
        console.log('true')
        this.expandAll(false)
      }
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments').then(res => {})
    }
    this.check().then(() => {
      this.loading = false
      console.log('----this.can.global:', this.can.global)
    })
  },
  methods: {
    toTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(item => delete item.children)

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      const map = {}
      data.forEach(item => {
        map[item.id] = item
      })
      //        console.log(map);
      const val = []
      data.forEach(item => {
        // 以当前遍历项的pid,去map对象中找到索引的id
        const parent = map[item.parentId]
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到他对应的父级中
        if (parent) {
          // ;(parent.children || (parent.children = [])).push(item)
          parent.children = parent.children ?? []
          parent.children.push(item)
        } else {
          // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item)
        }
      })
      return val
    },
    /**
     * @description: 根据人员是否具备global权限懒加载树形菜单，如具备，则生成全局部门菜单。否则生成本单位部门菜单。
     * @param {object} node
     * @param {*} resolve
     * @return {*}
     */
    loadNode(node, resolve) {
      if (this.can.global && node.level === 0) {
        this.rootNode = node
        return resolve([{ name: '四川省司法行政戒毒系统', id: '68d1150ddfa247f8a129589a6d4dfbbd' }])
      }
      if (this.can.global && node.level === 1) {
        return resolve(this.organList)
      }
      if (node.level === 0) {
        this.rootNode = node
        return resolve(this.departmentList.filter(item => item.id === this.$store.getters.organ))
      }
      return resolve(this.departmentList.filter(item => item.parentId === node.data.id))
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(obj) {
      this.$emit('nodeClick', obj.id)
    },
    expandAll(expand) {
      const root = this.$refs.selectTree.store.root
      const children = root.childNodes
      this.recursionCollapse(expand, 0, children)
    },
    recursionCollapse(expanded, index, nodes) {
      if (!nodes || index === nodes.length) return
      nodes[index].expanded = expanded
      if (nodes[index].childNodes) {
        this.recursionCollapse(expanded, 0, nodes[index].childNodes)
      }
      return this.recursionCollapse(expanded, index + 1, nodes)
    }
  }
}
</script>

<style></style>
