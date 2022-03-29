/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-03-09 09:40:35
 * @LastEditors: truxcoder
 * @Description: 根据角色处理路由，得到允许访问的路由，形成用户菜单。
 */
import { asyncRoutes, constantRoutes, componentList } from '@/router'
import { getModuleList, moduleRole } from '@/api/module'
import Layout from '@/layout'

/**
 * 用meta.role判断当前用户是否具备权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，把不具备访问权限的路由过滤掉
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  originRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ORIGIN_ROUTES: (state, routes) => {
    state.originRoutes = routes
  }
}

const actions = {
  async getOriginRoutes({ commit, state }, roles) {
    const response = await getModuleList({})
    // moduleNameList:模块名称数组
    const moduleNameList = response.data.map(i => i.name)
    const roles_ = await moduleRole(moduleNameList)
    const roleMap = {}
    // 遍历查询结果，生成map[moduleName][roleArray]形式的对象
    roles_.data.forEach(item => {
      if (item.module in roleMap) {
        roleMap[item.module].push(item.roles)
      } else {
        roleMap[item.module] = [item.roles]
      }
    })
    // 以下构建route对象
    const moduleList = response.data
    let superModules = moduleList.filter(item => item.rank === 1)
    const subModules = moduleList.filter(item => item.rank === 2)
    superModules = superModules.map(item => {
      const { id, path, redirect, name, title, icon, param } = item
      let children = subModules.filter(item => item.parent === id)
      children = children.map(item => {
        const { path, name, component, title, icon, param } = item
        return {
          path: path,
          name,
          component: componentList[component],
          meta: { title, icon, param, roles: roleMap[name] ?? [] }
        }
      })
      return {
        path: path,
        component: Layout,
        redirect,
        name,
        meta: { title, icon, param, roles: roleMap[name] ?? [] },
        children
      }
    })
    // 把构建结果与非权限路由连结起来
    const result = superModules.concat(asyncRoutes)
    return new Promise(resolve => {
      // let accessedRoutes
      // 如果用户具备root角色，则返回所有路由，否则进行筛选，得到允许访问的路由
      // if (roles.includes('root')) {
      //   accessedRoutes = result || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(result, roles)
      // }
      const accessedRoutes = filterAsyncRoutes(result, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateRoutes({ commit, state }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      console.log('state.originRoutes', state.originRoutes)
      if (roles.includes('admin')) {
        accessedRoutes = state.originRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(state.originRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
