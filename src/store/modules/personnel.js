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
    // getPersonnelName().then(response => {
    //   const personnelOptions = response.data.map(item => {
    //     return {
    //       value: item.id,
    //       label: item.name + ' 〔' + item.policeCode + '〕'
    //     }
    //   })
    //   commit('CHANGE_PER_OPTIONS', personnelOptions)
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
