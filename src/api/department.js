/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2022-01-10 17:19:57
 * @LastEditors: truxcoder
 * @Description:
 */
import request from '@/utils/request'

export function getDepartmentList(params) {
  return request({
    url: '/department/list',
    method: 'post',
    params
  })
}

export function getOrganList(params) {
  return request({
    url: '/department/organ',
    method: 'post',
    params
  })
}

export function updateDeptOrder(data) {
  return request({
    url: '/department/order',
    method: 'post',
    data
  })
}
export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'post',
    data
  })
}
