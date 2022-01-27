/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-01-17 15:38:59
 * @LastEditors: truxcoder
 * @Description:
 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getTicket } from '@/utils/auth' // get token from cookie
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
  // const hasToken = 'admin-token'
  if (hasToken) {
    if (to.path === '/403' || to.path === '/auth') {
      // if is logged in, redirect to the home page
      next(to.path)
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          if (roles[0] === 'normal') {
            next(`/perdetail?id=${hasToken}`)
          } else {
            const accessRoutes = await store.dispatch('permission/getOriginRoutes', roles)
            // dynamically add accessible routes
            router.addRoutes(accessRoutes)
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '发生错误！')
          // next(`/login?redirect=${to.path}`)
          next(`/nologin?redirect=${to.path}`)
          // 省局单点登陆地址
          // next(loginURL)
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
      request('user', 'login', {}, params).then(response => {
        console.log('login response:', response)
        if (!response.isValid) {
          next('/403')
        } else {
          store.dispatch('user/login', response.token).then(() => {
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
