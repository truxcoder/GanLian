<!--
 * @Author: truxcoder
 * @Date: 2021-12-13 17:15:04
 * @LastEditTime: 2022-02-11 09:43:26
 * @LastEditors: truxcoder
 * @Description: 重构分配权限
-->
<template>
  <el-dialog v-loading="dialogLoading" :width="dialogWidth" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div>
      <table v-if="Object.keys(permissionMap).length">
        <tr v-for="item in moduleData" :key="item.name" class="h-10">
          <td class=" px-2">{{ item.title }}</td>
          <td>
            <el-button-group>
              <el-button v-for="i in actList" :key="i" size="small" :type="permissionMap[item.name][i] ? 'primary' : 'warn'" @click="handleClick(item.name, i)">{{ permissionDict[i] }}</el-button>
            </el-button-group>
          </td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from '@/api'
import { permissionDict } from '@/utils/dict'
export default {
  name: 'PermissionSet',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      moduleData: [],
      originData: [],
      originMap: {},
      permissionMap: {},
      dialogLoading: false,
      dialogWidth: '900px'
    }
  },
  computed: {
    permissionDict() {
      return permissionDict
    },
    actList() {
      return Object.keys(permissionDict)
    }
  },
  watch: {
    visible: function(val, oldval) {
      if (val === true) {
        this.dialogLoading = true
        if (this.moduleData.length === 0) {
          request('module', 'list', {}).then(res => {
            this.moduleData = res.data ?? []
            this.resetMap()
            this.fetchData({ role: this.role })
          })
        } else {
          this.fetchData({ role: this.role })
        }
      } else {
        this.originData = []
        this.resetMap()
      }
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData(data = {}) {
      request('role', 'permission', data).then(response => {
        this.originData = response.data ?? []
        if (this.originData.length > 0) {
          this.originData.forEach(item => {
            if (this.originMap[item[1]]) {
              this.originMap[item[1]][item[2]] = true
              this.permissionMap[item[1]][item[2]] = true
            }
          })
        }
        this.dialogLoading = false
      })
    },
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      this.dialogLoading = true
      const added = []
      const deled = []
      const params = { add: false, del: false }
      Object.keys(this.permissionMap).forEach(obj => {
        this.actList.forEach(act => {
          if (this.permissionMap[obj][act] && !this.originMap[obj][act]) {
            added.push([this.role, obj, act])
          } else if (!this.permissionMap[obj][act] && this.originMap[obj][act]) {
            deled.push([this.role, obj, act])
          }
        })
      })
      if (added.length > 0) {
        params.add = true
      }
      if (deled.length > 0) {
        params.del = true
      }
      const data = { add: added, del: deled }
      console.log('added:', added)
      console.log('deled:', deled)
      request('permission', 'manage', data, params)
        .then(response => {
          this.$message.success(response.message)
          this.dialogLoading = false
          this.$emit('visibleChange')
        })
        .catch(err => {
          console.log(err)
          this.dialogLoading = false
        })

      // this.$refs.addForm.validate(valid => {
      // if (valid) {
      //   this.dialogLoading = true
      //   roleAdd(this.form)
      //     .then(response => {
      //       this.$message({
      //         message: response.message,
      //         type: 'success'
      //       })
      //       this.dialogLoading = false
      //       this.$emit('addSuccess')
      //       this.$refs.addForm.resetFields()
      //       this.personnelOpitons = []
      //       // Object.keys(this.form).forEach(key => this.form[key]='')
      //     })
      //     .catch(err => {
      //       // this.$message.error(err.message)
      //       console.log(err)
      //       this.dialogLoading = false
      //     })
      // } else {
      //   this.$message.error('请按规则填写表格！')
      //   return false
      // }
      // })
    },
    buttonType(obj, act) {
      if (this.permissionMap[obj].includes(act)) {
        return 'primary'
      }
      return 'warn'
    },
    handleClick(obj, act) {
      this.$set(this.permissionMap[obj], act, !this.permissionMap[obj][act])
    },
    handleSelect(item) {
      console.log(item)
    },
    resetMap() {
      if (this.moduleData.length > 0) {
        this.moduleData.forEach(item => {
          this.$set(this.originMap, item.name, {})
          this.$set(this.permissionMap, item.name, {})
          this.actList.forEach(i => {
            this.$set(this.originMap[item.name], i, false)
            this.$set(this.permissionMap[item.name], i, false)
          })
        })
      } else {
        this.originMap = {}
        this.permissionMap = {}
      }
    },
    onCancel() {
      this.$emit('visibleChange')
    }
  }
}
</script>

<style></style>
