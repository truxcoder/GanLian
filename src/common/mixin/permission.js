/*
 * @Author: truxcoder
 * @Date: 2021-12-14 11:15:43
 * @LastEditTime: 2024-12-12 17:13:04
 * @LastEditors: truxcoder
 * @Description: 权限检查相关
 */
import { request } from '@/api'
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
        MENU: false,
        GLOBAL: false,
        SPECIAL: false,
        GLOBAL_ADD: false,
        GLOBAL_UPDATE: false,
        GLOBAL_DELETE: false,
        GLOBAL_MANAGE: false,
      },
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
        menu: this.permission.MENU,
        global: this.permission.GLOBAL,
        special: this.permission.SPECIAL,
        addGlobal: this.permission.GLOBAL_ADD || this.permission.GLOBAL_MANAGE,
        deleteGlobal:
          this.permission.GLOBAL_DELETE || this.permission.GLOBAL_MANAGE,
        updateGlobal:
          this.permission.GLOBAL_UPDATE || this.permission.GLOBAL_MANAGE,
        manageGlobal: this.permission.GLOBAL_MANAGE,
      }
    },
    defaultSearchData() {
      return this.can.global ? {} : { organId: this.$store.getters.organ }
    },
  },
  methods: {
    check(object = null) {
      return new Promise((resolve, reject) => {
        const sub =
          this.$store.getters.roles.length === 1 &&
          this.$store.getters.roles[0] === 'normal'
            ? 'normal'
            : this.$store.getters.id
        const obj = object ?? this.$options.name
        const act = [
          'ADD',
          'DELETE',
          'UPDATE',
          'READ',
          'MANAGE',
          'MENU',
          'GLOBAL',
          'SPECIAL',
          'GLOBAL_ADD',
          'GLOBAL_DELETE',
          'GLOBAL_UPDATE',
          'GLOBAL_MANAGE',
        ]
        request('permission', 'check', { sub, obj, act })
          .then((res) => {
            Object.assign(this.permission, res.data)
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    canRender(organId, act) {
      if (organId === this.$store.getters.organ) {
        return this.can[act]
      }
      return this.can[act + 'Global']
    },
  },
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
        MENU: false,
        GLOBAL: false,
        SPECIAL: false,
      },
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
        menu: this.permission.MENU,
        global: this.permission.GLOBAL,
        special: this.permission.SPECIAL,
      }
    },
  },
  methods: {
    async check() {
      const sub = this.$store.getters.id
      const obj = this.obj
      const act = [
        'ADD',
        'DELETE',
        'UPDATE',
        'READ',
        'MANAGE',
        'MENU',
        'GLOBAL',
        'SPECIAL',
      ]
      const res = await permissionCheck({ sub, obj, act })
      Object.assign(this.permission, res.data)
    },
  },
}
