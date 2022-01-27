/*
 * @Author: truxcoder
 * @Date: 2022-01-17 10:50:23
 * @LastEditTime: 2022-01-17 10:52:55
 * @LastEditors: truxcoder
 * @Description:
 */
const defaultSettings = require('@/settings.js')
export function getPhoto(id, size) {
  return defaultSettings.staticURL + 'photo/' + size + '/' + id + '_' + size + '.jpeg'
}
