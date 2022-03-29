/*
 * @Author: truxcoder
 * @Date: 2022-01-17 10:50:23
 * @LastEditTime: 2022-03-15 14:23:58
 * @LastEditors: truxcoder
 * @Description:
 */

import router from '@/router'

const defaultSettings = require('@/settings.js')
export function getPhoto(id, size) {
  return defaultSettings.staticURL + 'photo/' + size + '/' + id + '_' + size + '.jpeg'
}

export function getDetailLink(id) {
  const url = router.resolve({
    path: '/perdetail',
    query: { id }
  })
  return url.href
}
