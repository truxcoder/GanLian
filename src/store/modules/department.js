/*
 * @Author: truxcoder
 * @Date: 2021-12-06 15:25:51
 * @LastEditTime: 2022-03-02 14:57:04
 * @LastEditors: truxcoder
 * @Description:
 */
import { getDepartmentList } from '@/api/department'
import { oldDepartmentDict } from '@/utils/dict'

const state = {
  departments: [],
  departmentNames: []
}

const mutations = {
  SET_DEPARTMENTS: (state, payload) => {
    state.departments = payload
  },
  SET_DEPARTMENT_NAMES: (state, payload) => {
    state.departmentNames = payload
  }
}

const actions = {
  setDepartments({ commit }) {
    return new Promise((resolve, reject) => {
      getDepartmentList()
        .then(response => {
          const names = Array.from(new Set(response.data.map(item => item.name).concat(oldDepartmentDict)))
          commit('SET_DEPARTMENTS', response.data)
          commit('SET_DEPARTMENT_NAMES', names)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
