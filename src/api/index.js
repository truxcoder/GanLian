/*
 * @Author: truxcoder
 * @Date: 2022-01-07 15:13:48
 * @LastEditTime: 2022-01-25 09:22:45
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
