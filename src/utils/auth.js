/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-04-06 17:47:19
 * @LastEditors: truxcoder
 * @Description:
 */
import Cookies from 'js-cookie'

const TokenKey = 'role_token'
const IDkey = 'user_id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTicket() {
  return Cookies.get('ticket')
}

export function setTicket(ticket) {
  return Cookies.set('ticket', ticket)
}

export function removeTicket() {
  return Cookies.remove('ticket')
}

export function getUserID() {
  return Cookies.get(IDkey)
}

export function setUserID(id) {
  return Cookies.set(IDkey, id)
}

export function removeUserID() {
  return Cookies.remove(IDkey)
}

/**
 * [通过参数名获取url中的参数值]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param  {[string]} queryName [参数名]
 * @return {[string]}           [参数值]
 */
export function GetQueryValue(queryName) {
  var query = decodeURI(window.location.search.substring(1))
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === queryName) {
      return pair[1]
    }
  }
  return null
}
