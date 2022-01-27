/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-01-10 17:21:11
 * @LastEditors: truxcoder
 * @Description:
 */
import request from '@/utils/request'

export function getModuleList(params) {
  return request({
    url: '/module/list',
    method: 'post',
    params
  })
}

export function addModule(data) {
  return request({
    url: '/module/add',
    method: 'post',
    data
  })
}
export function updateModule(data) {
  return request({
    url: '/module/update',
    method: 'post',
    data
  })
}
export function deleteModule(data) {
  return request({
    url: '/module/delete',
    method: 'post',
    data
  })
}
export function orderModule(data) {
  return request({
    url: '/module/order',
    method: 'post',
    data
  })
}

export function moduleRole(data) {
  return request({
    url: '/module/role',
    method: 'post',
    data
  })
}
