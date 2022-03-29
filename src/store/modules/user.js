import { logout } from '@/api/user'
import { request } from '@/api/'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    idCode: '',
    name: '',
    avatar: '',
    organ: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_IDCODE: (state, idCode) => {
    state.idCode = idCode
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ORGAN: (state, organ) => {
    state.organ = organ
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  setAvatar({ commit }, avatar) {
    console.log('---avatar:', avatar)
    commit('SET_AVATAR', avatar)
  },
  // 测试单点认证
  auth({ commit }, userInfo) {
    const { id, name, roles } = userInfo
    console.log('userInfo:', userInfo)
    console.log('----roles:', roles)
    commit('SET_TOKEN', id)
    commit('SET_ID', id)
    commit('SET_NAME', name)
    commit('SET_AVATAR', id + '_mini.jpeg')
    // commit('SET_ROLES', roles)
    commit('SET_TEMP_ROLES', roles)
    setToken(id)
    return new Promise((resolve, reject) => {
      resolve('admin-token')
    })
  },
  // user login
  login({ commit }, token) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = state.token
      request('user', 'info', { id: token })
        .then(response => {
          const { data } = response
          if (!data) {
            return reject('验证失败，请重新登录。')
          }
          const { id, roles, name, organ, idCode } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles 须为非空数组!')
          }
          commit('SET_ROLES', roles)
          commit('SET_ID', id)
          commit('SET_IDCODE', idCode)
          commit('SET_NAME', name)
          commit('SET_ORGAN', organ)
          commit('SET_AVATAR', idCode + '_mini.jpeg')
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('SET_ROLES', [])
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
