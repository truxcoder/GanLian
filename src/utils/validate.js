/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-04-13 19:00:38
 * @LastEditors: truxcoder
 * @Description: 数据验证相关方法
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @description: 身份证验证
 * @param {string} id
 * @return {boolean}
 */
export function idCodeValidate(id) {
  const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  return id.search(reg) !== -1
}

/**
 * @description: 判断数据是否为空
 * @param {any}
 * @return {boolean}
 */
export function isEmpty(obj) {
  switch (Object.prototype.toString.call(obj)) {
    case '[object String]':
      return obj === ''
    case '[object Number]':
      return obj === 0
    case '[object Array]':
      return obj.length === 0
    case '[object Boolean]':
      return !obj
    case '[object Object]':
      return Reflect.ownKeys(obj).length === 0 && obj.constructor === Object
    default:
      return false
  }
}
