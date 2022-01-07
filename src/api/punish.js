/*
 * @Author: truxcoder
 * @Date: 2021-12-22 15:13:25
 * @LastEditTime: 2021-12-22 15:14:36
 * @LastEditors: truxcoder
 * @Description:
 */
import request from '@/utils/request'

export function punishList(data, params) {
  return request({
    url: '/punish/list',
    method: 'post',
    data,
    params
  })
}

export function punishDetail(data) {
  return request({
    url: '/punish/detail',
    method: 'post',
    data
  })
}

export function punishAdd(data) {
  return request({
    url: '/punish/add',
    method: 'post',
    data
  })
}

export function punishUpdate(data) {
  return request({
    url: '/punish/update',
    method: 'post',
    data
  })
}
export function punishDelete(data) {
  return request({
    url: '/punish/delete',
    method: 'post',
    data
  })
}
