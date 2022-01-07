/*
 * @Author: truxcoder
 * @Date: 2022-01-07 15:13:48
 * @LastEditTime: 2022-01-07 15:22:06
 * @LastEditors: truxcoder
 * @Description: 通用请求接口
 */
import request from '@/utils/request'

export function requestData(obj, act, data, params) {
  const url = '/' + obj + '/' + act
  return request({
    url,
    method: 'post',
    data,
    params
  })
}
