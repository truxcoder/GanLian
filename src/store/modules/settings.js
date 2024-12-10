/*
 * @Author: truxcoder
 * @Date: 2022-11-06 21:14:16
 * @LastEditTime: 2024-04-06 18:16:05
 * @LastEditors: truxcoder
 * @Description:
 */
import defaultSettings from '@/settings'
import { request } from '@/api/'

const { showSettings, fixedHeader, sidebarLogo, staticURL } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  queryMeans: 'backend',
  setting: '',
  staticURL: staticURL,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  changeSettingFromDB({ commit }) {
    request('setting', 'list').then((response) => {
      const res = response.data || []
      const content = JSON.parse(res[0]?.content)
      commit('CHANGE_SETTING', { key: 'setting', value: content })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
