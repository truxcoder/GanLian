/*
 * @Author: truxcoder
 * @Date: 2021-12-14 11:15:43
 * @LastEditTime: 2021-12-22 09:11:47
 * @LastEditors: truxcoder
 * @Description: 权限检查相关
 */
import { permissionCheck } from '@/api/permission'
export const permission_mixin = {
  data() {
    return {
      permission: {
        ADD: false,
        DELETE: false,
        UPDATE: false,
        READ: false,
        MANAGE: false,
        MENU: false
      }
    }
  },
  computed: {
    can() {
      return {
        add: this.permission.MANAGE || this.permission.ADD,
        delete: this.permission.MANAGE || this.permission.DELETE,
        update: this.permission.MANAGE || this.permission.UPDATE,
        read: this.permission.MANAGE || this.permission.READ,
        manage: this.permission.MANAGE,
        menu: this.permission.MENU
      }
    }
  },
  created() {
    this.check()
  },
  methods: {
    check() {
      const sub = this.$store.getters.id
      const obj = this.$options.name
      const act = ['ADD', 'DELETE', 'UPDATE', 'READ', 'MANAGE', 'MENU']
      permissionCheck({ sub, obj, act }).then(response => {
        Object.assign(this.permission, response.data)
      })
    }
  }
}

export const detail_permission_mixin = {
  data() {
    return {
      permission: {
        ADD: false,
        DELETE: false,
        UPDATE: false,
        READ: false,
        MANAGE: false,
        MENU: false
      }
    }
  },
  computed: {
    can() {
      return {
        add: this.permission.MANAGE || this.permission.ADD,
        delete: this.permission.MANAGE || this.permission.DELETE,
        update: this.permission.MANAGE || this.permission.UPDATE,
        read: this.permission.MANAGE || this.permission.READ,
        manage: this.permission.MANAGE,
        menu: this.permission.MENU
      }
    }
  },
  created() {
    this.check()
  },
  methods: {
    check() {
      const sub = this.$store.getters.id
      const obj = this.obj
      const act = ['ADD', 'DELETE', 'UPDATE', 'READ', 'MANAGE', 'MENU']
      permissionCheck({ sub, obj, act }).then(response => {
        Object.assign(this.permission, response.data)
      })
    }
  }
}
