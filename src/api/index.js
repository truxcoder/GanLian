/*
 * @Author: truxcoder
 * @Date: 2022-01-07 15:13:48
 * @LastEditTime: 2022-04-06 14:50:42
 * @LastEditors: truxcoder
 * @Description: 通用请求接口
 */
import service from '@/utils/request'

export function request(obj, act, data, params) {
  const url = act ? '/' + obj + '/' + act : '/' + obj

  return service({
    url,
    method: 'post',
    data,
    params
  })
}

export function curd(act, data, params) {
  const url = '/' + act

  return service({
    url,
    method: 'post',
    data,
    params
  })
}

export function del(obj, id) {
  const url = '/' + obj + '/' + id
  return service({
    url,
    method: 'delete'
  })
}
