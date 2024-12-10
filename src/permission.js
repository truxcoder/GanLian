/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2024-04-06 17:57:15
 * @LastEditors: truxcoder
 * @Description: 导航守卫，动态获取路由
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getTicket, getUserID } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { request } from '@/api'
const defaultSettings = require('@/settings.js')

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/auth', '/403'] // no redirect whitelist
const service = 'http://' + defaultSettings.URL

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  const ticket = getTicket()
  if (!ticket) {
    window.location.href = defaultSettings.centerURL + '?service=' + service
    return
  }
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  // const userId = getUserID
  // const hasToken = 'admin-token'
  if (hasToken) {
    if (to.path === '/403' || to.path === '/auth') {
      // if is logged in, redirect to the home page
      // next(to.path)
      next()
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // note: roles 必须为数组! 如: ['admin'] or ,['developer','editor']
          const { roles, personnelId } = await store.dispatch('user/getInfo')
          await store.dispatch('settings/changeSettingFromDB')
          // 如果用户仅为普通用户，则强制跳转到其个人页面
          // FIXME: jwt认证后需要重新获取id
          if (roles[0] === 'normal') {
            // next(`/perdetail?id=${hasToken}`)
            next(`/perdetail?id=${personnelId}`)
          } else {
            const accessRoutes = await store.dispatch('permission/getOriginRoutes', roles)
            router.addRoutes(accessRoutes)
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          }
        } catch (error) {
          console.log('permission err', error)
          await store.dispatch('user/resetToken')
          Message.error(error || '发生错误！')
          next(`/nologin?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    // if (whiteList.indexOf(to.path) !== -1 || ticket) {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      const params = { ticket, service }
      request('user', 'login', {}, params).then((response) => {
        // console.log('login response:', response)
        if (!response.isValid) {
          next('/403')
        } else {
          // 用户单点登录认证
          store.dispatch('user/login', response.data).then(() => {
            next(to.path ?? '/dashboard')
            // window.location.href = defaultSettings.URL + '/#/dashboard'
          })
        }
      })
      // next(`/auth?redirect=${to.path}`)
      // 省局统一单点CAS认证地址
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
