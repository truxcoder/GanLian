/*
 * @Author: truxcoder
 * @Date: 2021-12-01 16:25:23
 * @LastEditTime: 2022-04-19 21:47:55
 * @LastEditors: truxcoder
 * @Description:
 */
import { request } from '@/api'
const state = {
  personnelOptions: [],
  perDptMap: {}
}

const mutations = {
  CHANGE_PER_OPTIONS: (state, payload) => {
    state.personnelOptions = payload
  },
  CHANGE_PER_DPT_MAP: (state, payload) => {
    state.perDptMap = payload
  }
}

const actions = {
  changePerOptions({ commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      const data = { accountId: rootGetters.id, organId: rootGetters.organ }
      request('personnel', 'base_list', data)
        .then(response => {
          const personnelOptions = response.data.map(item => {
            return {
              value: item.id,
              label: item.name + ' 〔' + item.policeCode + '〕' + '〔' + item.organShortName + '〕'
            }
          })
          commit('CHANGE_PER_OPTIONS', personnelOptions)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  changePerDptMap({ commit }) {
    request('personnel', 'organs').then(res => {
      commit('CHANGE_PER_DPT_MAP', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
