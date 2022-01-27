/*
 * @Author: truxcoder
 * @Date: 2021-12-01 16:25:23
 * @LastEditTime: 2022-01-24 11:19:37
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
  changePerOptions({ commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      const data = { personnelId: rootGetters.id, organId: rootGetters.organ }
      getPersonnelName(data)
        .then(response => {
          console.log('response:--', response)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
