/*
 * @Author: truxcoder
 * @Date: 2021-12-01 16:25:23
 * @LastEditTime: 2021-12-23 15:32:02
 * @LastEditors: truxcoder
 * @Description:
 */
import { getPersonnelName } from '@/api/personnel'
const state = {
  personnelOptions: []
}

const mutations = {
  CHANGE_PER_OPTIONS: (state, payload) => {
    state.personnelOptions = payload
  }
}

const actions = {
  changePerOptions({ commit }) {
    return new Promise((resolve, reject) => {
      getPersonnelName()
        .then(response => {
          const personnelOptions = response.data.map(item => {
            return {
              value: item.id,
              label: item.name + ' 〔' + item.policeCode + '〕'
            }
          })
          commit('CHANGE_PER_OPTIONS', personnelOptions)
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
