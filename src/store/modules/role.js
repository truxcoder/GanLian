import { roleDictList } from '@/api/role'
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
      roleDictList()
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
