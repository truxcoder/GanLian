<template>
  <div v-loading="listLoading" class="app-container user-container">
    <el-col :span="8">
      <el-card class="left-card">
        <el-row :gutter="20">
          <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="addFormVisible = true">添加</el-button>
          <el-button type="primary" :disabled="!isOrderChange" icon="el-icon-s-data" size="mini" @click="updateOrder">更新部门排序</el-button>
        </el-row>
        <el-row :gutter="20">
          <div class="tip"><i class="el-icon-info" />  可拖动排序，排序完成后需要点击更新部门排序按钮</div>
          <draggable tag="ul" :list="list" class="list-group" handle=".handle" @update="onOrderChange">
            <div v-for="(element, index) in list" :key="element.name" class="list-group-item">
              <el-col :span="18" class="li_text">
                <i class="el-icon-menu handle" />
                <span class="text">{{ element.name }} </span>
              </el-col>
              <el-col :span="6" class="oper_zone">
                <i class="el-icon-edit close" @click="handleEdit(element)" />
                <i class="el-icon-close close" @click="handleDelete(index,element.id)" />
              </el-col>
            </div>
          </draggable>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="right-card">
        <!-- <div class="user-tool-bar">
        <el-button type="success" @click="addFormVisible = true" icon="el-icon-circle-plus-outline" size="mini">添加</el-button>
        <el-button type="danger"  icon="el-icon-delete" @click="deleteMutiData" size="mini">删除</el-button>
        <el-button type="primary"  icon="el-icon-s-data" @click="fetchData({})" size="mini">所有数据</el-button>
      </div> -->
        <vue2-org-tree
          :data="treeData"
          :horizontal="true"
          :collapsable="true"
          :default-expand-all="true"
          :render-content="renderContent"
          @on-expand="onExpand"
        />

      </el-card>
    </el-col>

    <dept-add :add-form-visible="addFormVisible" :department-list="list" @addDataSuccess="addDataSuccess" @addVisibleChange="addVisibleChange" />
    <dept-edit :edit-form-visible="editFormVisible" :department-list="list" :current-edit-data="currentEditData" @updateDataSuccess="updateDataSuccess" @editVisibleChange="editVisibleChange" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getDepartmentList, deleteDepartment, updateDeptOrder } from '@/api/department'
import { transToTreeData } from '@/utils/user'
import DeptAdd from './DeptAdd'
import DeptEdit from './DeptEdit'
// Vue.use(Vue2OrgTree)
let id = 3
export default {
  name: 'Department',
  order: 5,
  components: { draggable, DeptAdd, DeptEdit },
  data() {
    return {
      list: [],
      listLoading: false,
      currentEditData: {},
      isOrderChange: false,
      editFormVisible: false,
      addFormVisible: false,
      expandAll: false,
      horizontal: false,
      collapsable: true,
      dragging: false,
      // treeData:{},
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    draggingInfo() {
      return this.dragging ? 'under drag' : ''
    },
    // dptData() {
    //   let tempObj = {...this.treeData[0]}
    //   this.toggleExpand(tempObj, true)
    //   return tempObj
    // }
    treeData() {
      const temp = transToTreeData(this.list)
      if (Array.isArray(temp)) {
        const tempObj = { ...(temp[0]) }
        this.toggleExpand(tempObj, true)
        return tempObj
      } else {
        return {}
      }
    }
  },
  created() {
    this.fetchData()
    this.fetchDptData()
  },
  methods: {
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
    },
    fetchData(params = {}) {
      getDepartmentList({}).then(response => {
        // this.list  = response.data.filter(item => item.isentity === 1 )
        this.list = response.data
      })
    },
    fetchDptData() {
      // getDepartmentList({}).then(response => {
      // this.list  = response.data.filter(item => item.isentity === 1 )
      // this.list  = response.data
      // this.treeData = transToTreeData(response.data)[0]
      // this.treeData = transToTreeData(this.list)[0]
      // this.toggleExpand(this.treeData, true)
      // this.list = transToTreeData(response.data)
      // })
    },
    removeAt(idx) {
      this.list.splice(idx, 1)
    },
    addDepartment() {
      id++
      this.dptData.push({ name: 'Juan ' + id, id, text: '' })
    },
    handleEdit(element) {
      this.currentEditData = element
      this.editFormVisible = true
    },
    handleDelete(index, id) {
      this.$confirm('将删除该部门, 该操作十分危险，极有可能造成不可逆的数据灭失！！！是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment({ id: [id] }).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.list.splice(index, 1)
        }).catch(err => {
          // this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onOrderChange() {
      this.isOrderChange = true
    },
    updateOrder() {
      this.listLoading = true
      const tempArray = []
      for (let i = 0; i < this.list.length; i++) {
        tempArray.push({ id: this.list[i].id, order: i + 1 })
      }
      updateDeptOrder({ orderData: tempArray }).then(response => {
        // this.list  = response.data.filter(item => item.isentity === 1 )
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.fetchData()
        this.isOrderChange = false
        this.listLoading = false
      })
    },
    addVisibleChange() {
      this.addFormVisible = false
    },
    editVisibleChange() {
      this.editFormVisible = false
    },
    addDataSuccess() {
      this.addFormVisible = false
      this.fetchData()
    },
    updateDataSuccess(row) {
      this.editFormVisible = false
      this.fetchData()
    },
    renderContent(h, data) {
      return data.label
    },
    onExpand(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand

        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    collapse(list) {
      var _this = this
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    expandChange: function() {
      this.toggleExpand(this.data, this.expandAll)
    },
    toggleExpand: function(data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    }
  }
}
</script>

<style scoped>
 @import '~vue2-org-tree/dist/style.css';
.user-container {
  display: flex;
}
.left-card {
  /* flex: 0 1 300px; */
  margin-right: 10px;
}
.right-card {
  /* flex: 1; */
  /* height: 2000px; */

}
.filter-tree {
  margin-top: 10px;
}
.oper-btn{
  font-size: 12px;
  margin: 0 5px;
}

.el-table--border, .el-table--group {
    border-color: #dedede;
}
.el-table--border:after, .el-table--group:after, .el-table:before {
    background-color: #dedede;
}
.el-table td, .el-table--border th,.el-table th.is-leaf {
    border-bottom-color: #dedede;
}
.el-table--border td, .el-table--border th {
    border-right-color: #dedede;
}

.pagination {
  margin-top: 15px;
}

.user-tool-bar {
  padding: 0 0 10px 0;
}

.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.close {
  /* float: right; */
  padding-top: 8px;
  margin-left: 10px;
  padding-bottom: 8px;
  cursor: pointer;
}
.oper_zone {
  text-align: right;
}
.text {
  margin: 0 20px;
  display: block;
  text-align: center;
}
.list-group {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
}
.list-group-item:first-child {
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
}
.list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: .25rem;
    border-bottom-left-radius: .25rem;
}
.list-group-item {
    position: relative;
    display: flex;
    padding: 5px 10px;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
}
.li_text {
  display: flex;
  align-items: center;
  /* padding-top: 5px; */
  /* align-self: center; */
  height: 100%;

}
.tip {
  font-size: 14px;
  color: red;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 5px 0;
  padding: 8px;
}
</style>
