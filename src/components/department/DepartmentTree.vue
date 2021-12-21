<template>
  <el-tree :load="loadNode" lazy :props="props" />
  <!-- <el-tree :data="dataList" :props="props" /> -->
</template>

<script>
export default {
  name: 'DepartmentTree',
  data() {
    return {
      list: [],
      props: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    departmentList() {
      return this.$store.getters.departments.map(item => {
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
      this.$store.getters.departments.forEach(item => {
        map[item.id] = item
      })
      return map
    },
    dataList() {
      return this.toTree(this.departmentList)
    }
  },
  created() {
    if (this.$store.getters.departments.length === 0) {
      this.$store.dispatch('department/setDepartments').then(res => {
        console.log('请求部门数据...数据长度：', this.$store.getters.departments.length)
      })
    }
    console.log('部门数据长度：', this.$store.getters.departments.length)
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
          // parent.children.push(item)
          ;(parent.children || (parent.children = [])).push(item)
        } else {
          // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item)
        }
      })
      return val
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '四川省司法行政戒毒系统', id: '68d1150ddfa247f8a129589a6d4dfbbd' }])
      }
      if (node.level === 1) {
        return resolve(this.organList)
      }
      return resolve(this.departmentList.filter(item => item.parentId === node.data.id))
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(nodeobj) {
      if (nodeobj.label === '资阳所') {
        this.fetchData()
      } else if (nodeobj.label === '大队') {
        return
      } else {
        this.fetchData({ department: nodeobj.label })
      }
    }
  }
}
</script>

<style></style>
