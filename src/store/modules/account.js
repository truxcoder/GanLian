/*
 * @Author: truxcoder
 * @Date: 2022-04-19 16:47:13
 * @LastEditTime: 2022-04-19 20:19:24
 * @LastEditors: truxcoder
 * @Description:
 */

import { request } from '@/api'
const state = {
  accountOptions: [],
  custom: []
}

const mutations = {
  CHANGE_ACCOUNT_OPTIONS: (state, payload) => {
    state.accountOptions = payload
  },
  CHANGE_CUSTOM: (state, payload) => {
    state.custom = payload
  }
}

const actions = {
  changeAccountOptions({ commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      const data = { accountId: rootGetters.id, organId: rootGetters.organ }
      request('account', 'base_list', data)
        .then(response => {
          const accountOptions = response.data.map(item => {
            return {
              value: item.id,
              label: item.name + ' 〔' + item.username + '〕' + '〔' + item.organShortName + '〕'
            }
          })
          commit('CHANGE_ACCOUNT_OPTIONS', accountOptions)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  changeCustom({ commit }, data) {
    request('custom', 'list', data).then(res => {
      commit('CHANGE_CUSTOM', res.data ?? [])
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
