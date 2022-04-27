/*
 * @Author: truxcoder
 * @Date: 2021-12-14 17:17:25
 * @LastEditTime: 2022-04-20 09:20:30
 * @LastEditors: truxcoder
 * @Description:
 */
import { request } from '@/api'
const state = {
  roleDict: []
}

const mutations = {
  SET_ROLE_DICT: (state, payload) => {
    state.roleDict = payload
  }
}

const actions = {
  setRoleDict({ commit }) {
    return new Promise((resolve, reject) => {
      request('role_dict', 'list')
        .then(response => {
          commit('SET_ROLE_DICT', response.data)
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
