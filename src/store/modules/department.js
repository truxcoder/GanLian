import { getDepartmentList } from '@/api/department'
const state = {
  departments: []
}

const mutations = {
  SET_DEPARTMENTS: (state, payload) => {
    state.departments = payload
  }
}

const actions = {
  setDepartments({ commit }) {
    return new Promise((resolve, reject) => {
      getDepartmentList()
        .then(response => {
          commit('SET_DEPARTMENTS', response.data)
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
